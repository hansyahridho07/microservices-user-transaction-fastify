FROM node:18.18.1

# Create app directory
WORKDIR /app/concreteai/transaction

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4001

CMD [ "npm", "run", "build-non-migrate" ]
# CMD [ "npm", "run", "build-non-migrate" ]
