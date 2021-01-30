FROM node:12

# Change working directory
WORKDIR "/app"

ARG ENV

# Update packages and install dependency packages for services
RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && echo 'Finished installing dependencies'

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm production packages 
RUN echo Build Environment: $ENV
RUN if [ '$ENV' = 'production' ] ; then npm install --production ; else npm install ; fi

COPY . /app

ENV NODE_ENV production

USER node

CMD ["npm", "start"]


