import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage } from "telegram/events";
import { CallbackQuery } from "telegram/events/CallbackQuery";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import { BigInteger } from "big-js";

const execAsync = promisify(exec);

// Bot Configuration
const API_ID = parseInt(process.env.API_ID || "0");
const API_HASH = process.env.API_HASH || "";
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const LOG_CHANNEL = process.env.LOG_CHANNEL || ""; 
const OWNER_ID = process.env.OWNER_ID || "";
const STRING_SESSION = process.env.STRING_SESSION || "";

// Font mapping
const fontMap: Record<string, string> = {
  a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪", j: "𝘫", k: "𝘬", l: "𝘭", m: "𝘮",
  n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵", u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
  A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑", K: "𝘒", L: "𝘓", M: "𝘔",
  N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛", U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡"
};

function toCoolFont(text: string): string {
  return text.split('').map(char => fontMap[char] || char).join('');
}

function generateProgressBar(percent: number): string {
  const length = 15;
  const filledLength = Math.round((percent / 100) * length);
  const emptyLength = length - filledLength;
  return "█".repeat(filledLength) + "░".repeat(emptyLength) + ` ${percent.toFixed(1)}%`;
}

// State Management
interface UserState {
  step: 'idle' | 'awaiting_type' | 'awaiting_text' | 'awaiting_image' | 'awaiting_position' | 'awaiting_size' | 'awaiting_opacity' | 'processing';
  videoMessage?: Api.Message;
  watermarkType?: 'text' | 'image';
  watermarkContent?: string;
  position?: string;
  size?: string;
  opacity?: string;
}

const userStates: Record<string, UserState> = {};
let client: TelegramClient;

export async function startBot() {
  if (!API_ID || !API_HASH || !BOT_TOKEN) {
    console.warn("Telegram Credentials missing.");
    return;
  }

  client = new TelegramClient(new StringSession(STRING_SESSION), API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    botAuthToken: BOT_TOKEN,
  });

  console.log("Telegram Bot started!");

  client.addEventHandler(async (event) => {
    try {
      const message = event.message;
      if (!message || !message.peerId) return;
      
      const sender = await message.getSender() as Api.User;
      if (!sender) return;
      
      const userId = sender.id.toString();
      const chatId = message.peerId;

      if (!userStates[userId]) userStates[userId] = { step: 'idle' };
      const state = userStates[userId];
      const text = message.text || "";

      if (text === "/start") {
        // Sticker logic
        try {
          const stickerMsg = await client.sendMessage(chatId, {
            file: "https://t.me/addstickers/Slaybie_by_fStikBot"
          });
          console.log("Sticker sent successfully");
          setTimeout(() => {
            if (stickerMsg) {
              client.deleteMessages(chatId, [stickerMsg.id], { revoke: true }).catch((e) => console.error("Delete sticker error:", e));
            }
          }, 3000);
        } catch (e) {
          console.error("Sticker error details:", e);
        }

        const username = sender.username ? `@${sender.username}` : (sender.firstName || "User");
        const welcomeText = toCoolFont(`Welcome ${username} to Video Watermark Bot!`);

        await client.sendMessage(chatId, {
          message: welcomeText,
          file: path.join(process.cwd(), "client/public/assets/welcome.jpg"),
          buttons: [
            [
              new Api.KeyboardButtonUrl({ text: "Developer", url: "https://t.me/TheEg0istX" }),
              new Api.KeyboardButtonUrl({ text: "Update", url: "https://t.me/+tU57Z7o0Az5mZThl" })
            ]
          ]
        });

        await storage.createUser({
          telegramId: userId,
          username: sender.username || null,
          firstName: sender.firstName || null,
        });

        state.step = 'idle';
        return;
      }

      if (state.step === 'awaiting_text') {
        state.watermarkContent = text;
        state.step = 'awaiting_position';
        await askPosition(chatId);
        return;
      }

      if (state.step === 'awaiting_image') {
        if (message.media && message.media instanceof Api.MessageMediaPhoto) {
          const path = await client.downloadMedia(message, { outputFile: `/tmp/wm_${userId}.jpg` });
          state.watermarkContent = path as string;
          state.step = 'awaiting_position';
          await askPosition(chatId);
        } else {
          await client.sendMessage(chatId, { message: "Please send an image for the watermark." });
        }
        return;
      }

      if (state.step === 'idle' || state.step === 'processing') {
        if (message.media && message.media instanceof Api.MessageMediaDocument) {
          const doc = message.media.document as Api.Document;
          if (doc.mimeType && doc.mimeType.startsWith('video/')) {
            state.videoMessage = message;
            state.step = 'awaiting_type';
            await client.sendMessage(chatId, {
              message: "Select Watermark Type:",
              buttons: [
                new Api.KeyboardButtonCallback({ text: "Text", data: Buffer.from("type_text") }),
                new Api.KeyboardButtonCallback({ text: "Image", data: Buffer.from("type_image") })
              ]
            });
          }
        }
      }
    } catch (e) {
      console.error("Handler error:", e);
    }
  }, new NewMessage({}));

  client.addEventHandler(async (event) => {
    try {
      const userId = event.query.userId.toString();
      if (!userStates[userId]) return;
      const state = userStates[userId];
      const data = event.query.data?.toString();
      if (!data) return;
      
      // Fix for CallbackQuery peer access
      let chatId: any;
      if ('peer' in event.query && event.query.peer) {
        chatId = event.query.peer;
      } else if ('userId' in event.query) {
        chatId = event.query.userId;
      }

      if (data === 'type_text') {
        state.watermarkType = 'text';
        state.step = 'awaiting_text';
        await client.sendMessage(chatId, { message: "Send the text for watermark:" });
      } else if (data === 'type_image') {
        state.watermarkType = 'image';
        state.step = 'awaiting_image';
        await client.sendMessage(chatId, { message: "Send the image for watermark:" });
      } else if (data.startsWith('pos_')) {
        state.position = data.replace('pos_', '');
        state.step = 'awaiting_size';
        await askSize(chatId);
      } else if (data.startsWith('size_')) {
        state.size = data.replace('size_', '');
        state.step = 'awaiting_opacity';
        await askOpacity(chatId);
      } else if (data.startsWith('opacity_')) {
        state.opacity = data.replace('opacity_', '');
        state.step = 'processing';
        await processVideo(userId, chatId);
      }
      await event.answer();
    } catch (e) {
      console.error("Callback error:", e);
    }
  }, new CallbackQuery({}));
}

async function askPosition(chatId: any) {
  await client.sendMessage(chatId, {
    message: "Select Position:",
    buttons: [
      [new Api.KeyboardButtonCallback({ text: "Top-Left", data: Buffer.from("pos_tl") }), new Api.KeyboardButtonCallback({ text: "Top-Right", data: Buffer.from("pos_tr") })],
      [new Api.KeyboardButtonCallback({ text: "Bottom-Left", data: Buffer.from("pos_bl") }), new Api.KeyboardButtonCallback({ text: "Bottom-Right", data: Buffer.from("pos_br") })],
      [new Api.KeyboardButtonCallback({ text: "Center", data: Buffer.from("pos_center") }), new Api.KeyboardButtonCallback({ text: "Motion", data: Buffer.from("pos_motion") })]
    ]
  });
}

async function askSize(chatId: any) {
  await client.sendMessage(chatId, {
    message: "Select Size:",
    buttons: [
      [new Api.KeyboardButtonCallback({ text: "Small", data: Buffer.from("size_small") }), new Api.KeyboardButtonCallback({ text: "Medium", data: Buffer.from("size_medium") }), new Api.KeyboardButtonCallback({ text: "Large", data: Buffer.from("size_large") })]
    ]
  });
}

async function askOpacity(chatId: any) {
  await client.sendMessage(chatId, {
    message: "Select Opacity:",
    buttons: [
      [new Api.KeyboardButtonCallback({ text: "25%", data: Buffer.from("opacity_0.25") }), new Api.KeyboardButtonCallback({ text: "50%", data: Buffer.from("opacity_0.5") })],
      [new Api.KeyboardButtonCallback({ text: "75%", data: Buffer.from("opacity_0.75") }), new Api.KeyboardButtonCallback({ text: "100%", data: Buffer.from("opacity_1.0") })]
    ]
  });
}

async function processVideo(userId: string, chatId: any) {
  const state = userStates[userId];
  if (!state.videoMessage) return;

  const statusMsg = await client.sendMessage(chatId, { message: "Starting process..." });

  const inputPath = `/tmp/input_${userId}_${Date.now()}.mp4`;
  const outputPath = `/tmp/output_${userId}_${Date.now()}.mp4`;

  try {
    // Download
    await client.downloadMedia(state.videoMessage, {
      outputFile: inputPath,
      progressCallback: (downloaded: any, total: any) => {
        const percent = (Number(downloaded) / Number(total)) * 100;
        client.editMessage(chatId, {
          message: `📥 Downloading...\n${generateProgressBar(percent)}`,
          id: statusMsg.id
        }).catch(() => {});
      }
    });

    await client.editMessage(chatId, { message: "⚙️ Progressing...", id: statusMsg.id });

    // Processing Logic (Simplified FFmpeg)
    let filter = "";
    let scale = "0.2";
    let fontSize = "32";
    if (state.size === 'small') { scale = "0.1"; fontSize = "16"; }
    else if (state.size === 'large') { scale = "0.4"; fontSize = "64"; }

    let x = "10", y = "10";
    if (state.position === 'tr') { x = "W-w-10"; y = "10"; }
    else if (state.position === 'bl') { x = "10"; y = "H-h-10"; }
    else if (state.position === 'br') { x = "W-w-10"; y = "H-h-10"; }
    else if (state.position === 'center') { x = "(W-w)/2"; y = "(H-h)/2"; }
    else if (state.position === 'motion') { x = "mod(t*100,W-w)"; y = "mod(t*50,H-h)"; }

    if (state.watermarkType === 'image') {
      filter = `movie=${state.watermarkContent}[wm];[wm]scale=iw*${scale}:-1[wmscaled];[wmscaled]format=rgba,colorchannelmixer=aa=${state.opacity}[wmfinal];[0:v][wmfinal]overlay=${x}:${y}`;
    } else {
      filter = `drawtext=text='${state.watermarkContent}':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=white:alpha=${state.opacity}:box=1:boxcolor=black@0.5`;
    }

    const cmd = `ffmpeg -y -i ${inputPath} -vf "${filter}" -c:a copy ${outputPath}`;
    await execAsync(cmd);

    // Upload
    await client.sendFile(chatId, {
      file: outputPath,
      caption: "Watermarked with ❤️ by Video SHIVAM BOT UPDATE=https://t.me/+tU57Z7o0Az5mZThl",
      progressCallback: (uploaded: any, total: any) => {
        const percent = (Number(uploaded) / Number(total)) * 100;
        client.editMessage(chatId, {
          message: `📤 Uploading...\n${generateProgressBar(percent)}`,
          id: statusMsg.id
        }).catch(() => {});
      }
    });

    await client.deleteMessages(chatId, [statusMsg.id], { revoke: true });

  } catch (err) {
    console.error(err);
    await client.sendMessage(chatId, { message: "Failed to process video." });
  } finally {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    state.step = 'idle';
  }
}
