FROM node:18

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv build-essential && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install tensorflow numpy Pillow

COPY . .

ENV PATH="/opt/venv/bin:$PATH"

EXPOSE 8080

CMD [ "npm", "run", "start" ]
