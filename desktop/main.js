const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    title: 'Vibe E-Book Store (Desktop App .EXE)',
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    backgroundColor: '#090d16',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // URL Target: either from environment (Vercel production URL) or default local server
  const targetUrl = process.env.DESKTOP_TARGET_URL || 'https://sw-ebook.vercel.app';
  mainWindow.loadURL(targetUrl);

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Setup Custom Desktop Application Menu
  const menuTemplate = [
    {
      label: 'ร้านค้า (Store)',
      submenu: [
        {
          label: 'หน้าร้าน (Catalog)',
          accelerator: 'CmdOrCtrl+H',
          click: () => mainWindow.loadURL(targetUrl),
        },
        {
          label: 'ติดตามคำสั่งซื้อ (Track Orders)',
          accelerator: 'CmdOrCtrl+T',
          click: () => mainWindow.loadURL(`${targetUrl}/track`),
        },
        { type: 'separator' },
        {
          label: 'ปิดโปรแกรม (Exit)',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'การนำทาง (Navigation)',
      submenu: [
        {
          label: 'ย้อนกลับ (Back)',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          },
        },
        {
          label: 'ไปข้างหน้า (Forward)',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          },
        },
        {
          label: 'โหลดใหม่ (Reload)',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.webContents.reload(),
        },
      ],
    },
    {
      label: 'มุมมอง (View)',
      submenu: [
        { role: 'resetZoom', label: 'ขนาดปกติ' },
        { role: 'zoomIn', label: 'ซูมเข้า' },
        { role: 'zoomOut', label: 'ซูมออก' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'เต็มจอ' },
      ],
    },
    {
      label: 'ช่วยเหลือ (Help)',
      submenu: [
        {
          label: 'เกี่ยวกับระบบ (About Demo)',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Vibe E-Book Store (Desktop .EXE)',
              message: 'Vibe Coding: E-book Shop System',
              detail: 'ระบบร้านค้า E-book ตัวอย่าง (Desktop View)\n\n• ป้ายเตือน: DEMO ONLY ไม่มีการตัดเงินจริง\n• พัฒนาด้วย Next.js และ Electron\n• เชื่อมโยง 3 แพลตฟอร์ม: Web, Mobile (.APK), Desktop (.EXE)',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
