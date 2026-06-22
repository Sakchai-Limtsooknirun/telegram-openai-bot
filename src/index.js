require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const { OpenAI } = require('openai');

// Initialize Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history per user
const conversationHistory = {};

// Middleware for session management
bot.use(session());

// Start command
bot.start((ctx) => {
  ctx.reply(
    '👋 Welcome! I\'m an AI bot powered by OpenAI.\n\n' +
    '📝 Just send me any message and I\'ll respond using GPT!\n\n' +
    'Commands:\n' +
    '/start - Show this welcome message\n' +
    '/clear - Clear your conversation history\n' +
    '/help - Show help information',
    {
      reply_markup: {
        keyboard: [
          [{ text: '/clear' }, { text: '/help' }],
        ],
        resize_keyboard: true,
      },
    }
  );
});

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    '❓ Help & Information\n\n' +
    '• Send any message to chat with AI\n' +
    '• Conversation history is maintained within your session\n' +
    '• /clear - Reset your conversation history\n' +
    '• /start - Show welcome message\n\n' +
    '⚙️ Model: ' + (process.env.OPENAI_MODEL || 'gpt-3.5-turbo') +
    '\n\n' +
    'Powered by OpenAI & Telegram'
  );
});

// Clear conversation history
bot.command('clear', (ctx) => {
  const userId = ctx.from.id;
  conversationHistory[userId] = [];
  ctx.reply('✅ Conversation history cleared! Let\'s start fresh.');
});

// Handle text messages
bot.on('message', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  // Skip if it's a command
  if (userMessage.startsWith('/')) {
    return;
  }

  // Initialize conversation history for new users
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // Show "typing" indicator
  await ctx.sendChatAction('typing');

  try {
    // Add user message to history
    conversationHistory[userId].push({
      role: 'user',
      content: userMessage,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: conversationHistory[userId],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiMessage = response.choices[0].message.content;

    // Add AI response to history
    conversationHistory[userId].push({
      role: 'assistant',
      content: aiMessage,
    });

    // Keep only last 20 messages to avoid token limit
    if (conversationHistory[userId].length > 20) {
      conversationHistory[userId] = conversationHistory[userId].slice(-20);
    }

    // Split long messages (Telegram limit is 4096 characters)
    if (aiMessage.length > 4096) {
      const chunks = aiMessage.match(/[\s\S]{1,4096}/g) || [];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    } else {
      await ctx.reply(aiMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    
    if (error.status === 401) {
      ctx.reply('❌ Invalid OpenAI API key. Please check your configuration.');
    } else if (error.status === 429) {
      ctx.reply('⏳ Rate limit exceeded. Please try again later.');
    } else {
      ctx.reply('❌ An error occurred: ' + error.message);
    }
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Telegraf error:', err);
  ctx.reply('❌ An unexpected error occurred. Please try again.');
});

// Start bot
if (process.env.NODE_ENV === 'production') {
  // Webhook mode for Vercel/Railway
  const port = process.env.PORT || 3000;
  bot.launch({
    webhook: {
      domain: process.env.WEBHOOK_URL,
      port: port,
    },
  });
  console.log(`🚀 Bot running in webhook mode on port ${port}`);
} else {
  // Polling mode for local development
  bot.launch();
  console.log('🚀 Bot started in polling mode');
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
