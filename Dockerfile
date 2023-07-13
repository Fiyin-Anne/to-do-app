###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

# Bundle app source
COPY --chown=node:node . .

RUN npm run prisma:generate

# Use the node user from the image (instead of the root user)
USER node
