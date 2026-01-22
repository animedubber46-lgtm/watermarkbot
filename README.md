# Video Watermark Telegram Bot

A powerful Telegram bot to add text or image watermarks to videos, with a built-in cyberpunk dashboard.

## Features
- Add text watermarks with customizable position, size, and opacity.
- Add image watermarks with transparency support.
- Cyberpunk dashboard for monitoring bot stats and jobs.
- Progress bars for downloading and uploading.

## Heroku Deployment

### 1. Requirements
- A Heroku account.
- MongoDB Atlas (or any MongoDB instance).
- Telegram API ID and API Hash (from my.telegram.org).
- Telegram Bot Token (from @BotFather).

### 2. Deployment Steps
1. Click the "Deploy to Heroku" button or use the Heroku CLI.
2. Set the following environment variables (Config Vars) in Heroku:
   - `API_ID`: Your Telegram API ID.
   - `API_HASH`: Your Telegram API Hash.
   - `BOT_TOKEN`: Your Telegram Bot Token.
   - `MONGODB_URI`: Your MongoDB connection string.
   - `SESSION_SECRET`: A random string for session security.
   - `DATABASE_URL`: (Optional) PostgreSQL URL for the dashboard stats if using persistent SQL.
3. The `heroku.yaml` file handles the build process using the Docker-like environment or custom buildpacks.

### 3. Manual Buildpack Setup
If not using the container stack, add these buildpacks:
1. `heroku/nodejs`
2. `https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git`

## Environment Variables
| Key | Description |
|-----|-------------|
| `API_ID` | Telegram API ID |
| `API_HASH` | Telegram API Hash |
| `BOT_TOKEN` | Telegram Bot Token |
| `MONGODB_URI` | MongoDB Connection URI |
| `OWNER_ID` | Your Telegram User ID |
