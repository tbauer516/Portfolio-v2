FROM node:8.9.1

COPY package*.json /
RUN chown -R node:node /home/node/
RUN npm install --no-optional

RUN set -xe \
  && curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

USER node
EXPOSE 8080
CMD ["node", "server.js"]
