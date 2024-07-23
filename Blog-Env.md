## 配置 Nginx

```bash
apt update
apt upgrade -y
apt install git nload htop tree screen neofetch -y
git config --global alias.st status
apt install curl vim wget gnupg dpkg apt-transport-https lsb-release ca-certificates -y

curl -sSL https://n.wtf/public.key | gpg --dearmor > /usr/share/keyrings/n.wtf.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/n.wtf.gpg] https://mirror-cdn.xtom.com/sb/nginx/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/n.wtf.list

apt install nginx-extras -y

nginx -V

nano /etc/nginx/sites-available/shiro.la
```

```nginx
server {
    listen 80;
    server_name shiro.la;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        if ($request_method = 'GET') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET';
            add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization';
        }
    }
}
```

```bash
ln -s /etc/nginx/sites-available/shiro.la /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 安装 Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
git clone https://github.com/TheDeathDragon/zero.git
cd zero/
npm install
npm i -g next
next dev
```

## 申请 SSL 证书

```bash
apt install software-properties-common python3-launchpadlib -y
apt install certbot python3-certbot-nginx -y

certbot --nginx
```

## 配置 System MD 守护进程

```bash
touch /root/zero/start.sh
nano /root/zero/start.sh
```

```bash
#!/bin/bash
. /root/.nvm/nvm.sh
git checkout
git pull
npm run build
npm run start
```

```bash
chmod +x /root/zero/start.sh
```

```bash
nano /etc/systemd/system/blog.service
systemctl daemon-reload

[Unit]
Description=Blog Zero
After=network.target

[Service]
ExecStart=/root/zero/start.sh
WorkingDirectory=/root/zero
Restart=on-failure
IgnoreSIGPIPE=false
KillMode=control-group
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable blog
systemctl start blog
```
