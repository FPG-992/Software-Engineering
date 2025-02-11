python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

sudo rm /usr/local/bin/se2401
chmod +x main.py
sudo ln -s "$(pwd)/main.py" /usr/local/bin/se2401