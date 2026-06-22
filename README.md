# 🤖 Telegram OpenAI Bot

A powerful Telegram bot integrated with OpenAI's GPT-4/ChatGPT API. Deploy easily on Vercel or Railway!

## ✨ Features

- 🤖 **AI-Powered Responses** - Uses OpenAI's GPT models
- 💬 **Conversation Memory** - Maintains chat history per user
- ⚡ **Fast & Lightweight** - Built with Node.js & Telegraf
- 🚀 **Easy Deployment** - One-click deploy to Vercel/Railway
- 🔒 **Secure** - Environment variables for sensitive data
- 📱 **Cross-Platform** - Works on any device with Telegram

## 📋 Prerequisites

Before you start, make sure you have:

1. **Telegram Bot Token** - Get it from [@BotFather](https://t.me/botfather)
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Follow the steps and copy your token

2. **OpenAI API Key** - Get it from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in to your OpenAI account
   - Navigate to API keys section
   - Create a new secret key
   - Copy and save it safely

3. **Git** - [Download Git](https://git-scm.com/)

## 🚀 Deployment Options

### Option 1: Deploy on Railway (Recommended)

Railway is the easiest for this bot!

1. **Fork this repository** to your GitHub account
2. Go to [Railway.app](https://railway.app)
3. Click **"Create New Project"** → **"Deploy from GitHub"**
4. Select your forked repository
5. Add environment variables:
   - `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NODE_ENV` - Set to `production`
   - `WEBHOOK_URL` - Your Railway app URL (Railway provides this)
6. Click **"Deploy"** ✅

That's it! Your bot is live!

### Option 2: Deploy on Vercel

1. **Fork this repository** to your GitHub account
2. Go to [Vercel.com](https://vercel.com)
3. Click **"Import Project"** → **"Import Git Repository"**
4. Select your forked repository
5. Add environment variables in the "Environment Variables" section:
   - `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NODE_ENV` - Set to `production`
   - `WEBHOOK_URL` - Your Vercel deployment URL
6. Click **"Deploy"** ✅

### Option 3: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/telegram-openai-bot.git
   cd telegram-openai-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` and add your credentials:**
   ```
   TELEGRAM_BOT_TOKEN=your_token_here
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   NODE_ENV=development
   ```

5. **Start the bot:**
   ```bash
   npm run dev
   ```

## 🎮 How to Use

Once deployed or running locally:

1. **Find your bot on Telegram** - Search for the bot name you created with @BotFather
2. **Start chatting** - Click `/start` or just send any message
3. **Available commands:**
   - `/start` - Show welcome message
   - `/help` - Show help information
   - `/clear` - Clear conversation history

## 📝 Configuration

Edit `src/index.js` to customize:

- **Model**: Change `gpt-3.5-turbo` to `gpt-4` for better responses (more expensive)
- **Temperature**: Adjust creativity (0.0-2.0, default 0.7)
- **Max tokens**: Limit response length
- **Conversation history**: Keep only recent messages

## 🛠️ Troubleshooting

### Bot not responding
- Check if `TELEGRAM_BOT_TOKEN` is correct
- Make sure the bot is deployed and running
- Test with `/start` command

### OpenAI errors
- Verify `OPENAI_API_KEY` is correct
- Check your OpenAI account has credits
- Monitor your API usage on [OpenAI Dashboard](https://platform.openai.com/account/usage/overview)

### Rate limiting
- OpenAI and Telegram have rate limits
- Wait a moment and try again
- Consider upgrading your OpenAI plan for higher limits

## 📊 Cost Considerations

- **Telegram**: Free
- **OpenAI**: Pay-as-you-go (starts with free credits)
  - GPT-3.5-turbo: ~$0.002 per 1K tokens (cheaper)
  - GPT-4: ~$0.03 per 1K tokens (better quality)
- **Railway/Vercel**: Free tier available

## 🔒 Security Tips

- ✅ Never commit `.env` file to Git (it's in .gitignore)
- ✅ Keep your API keys secret
- ✅ Use environment variables for sensitive data
- ✅ Monitor your API usage regularly
- ✅ Set spending limits in OpenAI dashboard

## 📚 Resources

- [Telegraf Documentation](https://telegraf.js.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

Feel free to fork, modify, and improve!

## 📄 License

MIT License - Feel free to use this project however you like!

## ⭐ Support

If this helped you, please consider giving it a star! ⭐

---

**Made with ❤️ using Node.js, Telegraf, and OpenAI**
