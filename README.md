# Ollama Chat

A ChatGPT-like interface for interacting with your local Ollama models.

## Features

- 🤖 Chat with your local Ollama models
- 🔄 Dynamically switch between different models
- 🌙 Dark/Light mode support
- 💾 Persistent chat history with SQLite database
- 📱 Responsive design
- 🔍 Check Ollama status and model availability
- 📥 Pull new models directly from the interface

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) installed and running locally

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ollama-chat.git
cd ollama-chat
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Ollama Setup

Make sure Ollama is installed and running:

```bash
# Start Ollama server
ollama serve
```

In a separate terminal, you can pull models:

```bash
# Pull a model (e.g., llama3)
ollama pull llama3
```

Or you can pull models directly from the Ollama Chat interface.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="file:./dev.db"
OLLAMA_API_URL="http://localhost:11434"
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database ORM
- [SQLite](https://www.sqlite.org/) - Database
- [Axios](https://axios-http.com/) - HTTP client
- [React Icons](https://react-icons.github.io/react-icons/) - Icons

## License

MIT
