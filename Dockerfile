FROM node:20
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 3000

RUN mkdir -p /app/lib/mini-waf/logs && \
    chown -R 1001:1001 /app/lib/mini-waf/logs

CMD ["./entrypoint.sh"]
