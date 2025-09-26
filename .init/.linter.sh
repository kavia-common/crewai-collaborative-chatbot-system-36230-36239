#!/bin/bash
cd /home/kavia/workspace/code-generation/crewai-collaborative-chatbot-system-36230-36239/chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

