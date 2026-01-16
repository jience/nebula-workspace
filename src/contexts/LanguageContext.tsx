import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en-US' | 'zh-CN' | 'ja-JP';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  'en-US': {
    // App / Nav
    'app.title': 'Nebula Workspace',
    'app.encrypted': 'Encrypted',
    'nav.home': 'Home',
    'nav.desktops': 'Desktops',
    'nav.apps': 'Apps',
    'nav.settings': 'Settings',
    'nav.signout': 'Sign Out',
    'search.placeholder': 'Search resources...',
    'status.gateway': 'Gateway',
    'status.connected': 'Connected',
    'status.cpu': 'Client CPU',
    'status.latency': 'Latency',
    
    // Login
    'login.title': 'Nebula Client',
    'login.subtitle': 'Enterprise Workspace Access',
    'login.identifier': 'Email or Username',
    'login.identifier_placeholder': 'username or name@company.com',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.connect': 'Connect',
    'login.connecting': 'Connecting...',
    'login.secure': 'Secure',
    'login.logging_out': 'Logging out...',

    // Dashboard
    'dash.all': 'All Resources',
    'dash.desktops': 'Cloud Desktops',
    'dash.apps': 'Virtual Applications',
    'dash.recent': 'Recent & Active',
    'dash.running': 'Running',
    'dash.stopped': 'Stopped',
    'dash.maintenance': 'Maintenance',
    'dash.region': 'Region',
    'dash.launch': 'Launch',
    'dash.history': 'History',
    'dash.recent_activity': 'Recent Activity',
    'dash.view_full': 'View Full History',
    'dash.no_active': 'No active sessions. Start a resource from the library below.',
    'dash.no_results': 'No active resources match your search.',
    'dash.empty_search': 'No resources found',
    'dash.empty_hint': 'Try adjusting your search terms or filters.',
    'dash.sort.name': 'Sort by Name',
    'dash.sort.status': 'Sort by Status',
    'dash.sort.usage': 'Sort by Usage',

    // Modal
    'modal.status': 'Current Status',
    'modal.close': 'Close',
    'modal.launch': 'Launch Session',

    // Settings
    'settings.title': 'Settings',
    'settings.tab.general': 'General',
    'settings.tab.display': 'Display & Graphics',
    'settings.tab.devices': 'Devices & Audio',
    'settings.tab.about': 'About',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save Changes',

    'settings.general.title': 'General Preferences',
    'settings.general.launch_startup': 'Launch at Startup',
    'settings.general.launch_startup_desc': 'Automatically start Nebula Client when you log in to your computer.',
    'settings.general.auto_connect': 'Auto-connect',
    'settings.general.auto_connect_desc': 'Automatically connect to the last used resource on launch.',
    'settings.general.language': 'Language',

    'settings.display.title': 'Display & Graphics',
    'settings.display.resolution': 'Resolution Strategy',
    'settings.display.monitors': 'Use All Monitors',
    'settings.display.monitors_desc': 'Span the remote desktop across all connected displays.',
    'settings.display.high_dpi': 'High DPI Scaling',
    'settings.display.high_dpi_desc': 'Enable smooth scaling for high-resolution displays (Retina/4K).',
    'settings.display.theme': 'Theme',
    'settings.display.theme.dark': 'Dark',
    'settings.display.theme.light': 'Light',
    'settings.display.theme.system': 'System',

    'settings.devices.title': 'Devices & Audio',
    'settings.devices.audio': 'Audio Output',
    'settings.devices.audio_default': 'Default System Output (Realtek High Definition Audio)',
    'settings.devices.mic': 'Microphone Passthrough',
    'settings.devices.mic_desc': 'Allow remote desktops to access your local microphone.',
    'settings.devices.webcam': 'Webcam Passthrough',
    'settings.devices.webcam_desc': 'Allow remote applications to use your local camera.',
    'settings.devices.usb': 'USB Device Redirection',
    'settings.devices.usb_desc': 'Automatically mount local USB drives in the remote session.',

    'settings.about.version': 'Version',
    'settings.about.uptodate': 'Up to date',
    'settings.about.release_notes': 'View Release Notes',
    'settings.about.rights': 'All rights reserved.',

    // User Profile
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save',
    'profile.pro': 'Pro',
    'profile.availability': 'Availability',
    'profile.status.online': 'Online',
    'profile.status.away': 'Away',
    'profile.status.dnd': 'Do Not Disturb',
    'profile.status.offline': 'Offline',
    'profile.department': 'Department',
    'profile.location': 'Location',
    'profile.email': 'Email',
    'profile.joined': 'Joined',
    'profile.sessions': 'Sessions',
    'profile.usage': 'Usage',
    'profile.signout': 'Sign Out',
  },
  'zh-CN': {
    // App / Nav
    'app.title': '星云工作台',
    'app.encrypted': '已加密',
    'nav.home': '首页',
    'nav.desktops': '云桌面',
    'nav.apps': '应用程序',
    'nav.settings': '设置',
    'nav.signout': '退出登录',
    'search.placeholder': '搜索资源...',
    'status.gateway': '网关',
    'status.connected': '已连接',
    'status.cpu': '客户端 CPU',
    'status.latency': '延迟',

    // Login
    'login.title': '星云客户端',
    'login.subtitle': '企业级工作空间接入',
    'login.identifier': '邮箱或用户名',
    'login.identifier_placeholder': '用户名或工作邮箱',
    'login.password': '密码',
    'login.remember': '记住我',
    'login.forgot': '忘记密码？',
    'login.connect': '连接',
    'login.connecting': '连接中...',
    'login.secure': '安全连接',
    'login.logging_out': '正在退出登录...',

    // Dashboard
    'dash.all': '所有资源',
    'dash.desktops': '云桌面',
    'dash.apps': '虚拟应用',
    'dash.recent': '最近使用 & 活跃',
    'dash.running': '运行中',
    'dash.stopped': '已停止',
    'dash.maintenance': '维护中',
    'dash.region': '区域',
    'dash.launch': '启动',
    'dash.history': '历史记录',
    'dash.recent_activity': '近期活动',
    'dash.view_full': '查看完整记录',
    'dash.no_active': '暂无活跃会话。请从下方资源库启动。',
    'dash.no_results': '没有匹配的活跃资源。',
    'dash.empty_search': '未找到资源',
    'dash.empty_hint': '请尝试调整搜索关键词或筛选条件。',
    'dash.sort.name': '按名称排序',
    'dash.sort.status': '按状态排序',
    'dash.sort.usage': '按使用率排序',

    // Modal
    'modal.status': '当前状态',
    'modal.close': '关闭',
    'modal.launch': '启动会话',

    // Settings
    'settings.title': '设置',
    'settings.tab.general': '常规',
    'settings.tab.display': '显示与显卡',
    'settings.tab.devices': '设备与音频',
    'settings.tab.about': '关于',
    'settings.cancel': '取消',
    'settings.save': '保存更改',

    'settings.general.title': '常规首选项',
    'settings.general.launch_startup': '开机自启',
    'settings.general.launch_startup_desc': '登录计算机时自动启动星云客户端。',
    'settings.general.auto_connect': '自动连接',
    'settings.general.auto_connect_desc': '启动时自动连接到上次使用的资源。',
    'settings.general.language': '语言',

    'settings.display.title': '显示与显卡',
    'settings.display.resolution': '分辨率策略',
    'settings.display.monitors': '使用所有显示器',
    'settings.display.monitors_desc': '将远程桌面扩展到所有连接的显示器。',
    'settings.display.high_dpi': '高 DPI 缩放',
    'settings.display.high_dpi_desc': '启用高分辨率显示器 (Retina/4K) 的平滑缩放。',
    'settings.display.theme': '主题',
    'settings.display.theme.dark': '深色',
    'settings.display.theme.light': '浅色',
    'settings.display.theme.system': '系统',

    'settings.devices.title': '设备与音频',
    'settings.devices.audio': '音频输出',
    'settings.devices.audio_default': '默认系统输出 (Realtek High Definition Audio)',
    'settings.devices.mic': '麦克风直通',
    'settings.devices.mic_desc': '允许远程桌面访问本地麦克风。',
    'settings.devices.webcam': '摄像头直通',
    'settings.devices.webcam_desc': '允许远程应用使用本地摄像头。',
    'settings.devices.usb': 'USB 设备重定向',
    'settings.devices.usb_desc': '自动在远程会话中挂载本地 USB 驱动器。',

    'settings.about.version': '版本',
    'settings.about.uptodate': '已是最新',
    'settings.about.release_notes': '查看发行说明',
    'settings.about.rights': '保留所有权利。',

    // User Profile
    'profile.edit': '编辑资料',
    'profile.save': '保存',
    'profile.pro': '专业版',
    'profile.availability': '状态',
    'profile.status.online': '在线',
    'profile.status.away': '离开',
    'profile.status.dnd': '请勿打扰',
    'profile.status.offline': '离线',
    'profile.department': '部门',
    'profile.location': '地点',
    'profile.email': '邮箱',
    'profile.joined': '加入时间',
    'profile.sessions': '会话数',
    'profile.usage': '使用时长',
    'profile.signout': '退出登录',
  },
  'ja-JP': {
    // App / Nav
    'app.title': 'Nebula ワークスペース',
    'app.encrypted': '暗号化済み',
    'nav.home': 'ホーム',
    'nav.desktops': 'デスクトップ',
    'nav.apps': 'アプリ',
    'nav.settings': '設定',
    'nav.signout': 'サインアウト',
    'search.placeholder': 'リソースを検索...',
    'status.gateway': 'ゲートウェイ',
    'status.connected': '接続済み',
    'status.cpu': 'CPU使用率',
    'status.latency': 'レイテンシ',

    // Login
    'login.title': 'Nebula クライアント',
    'login.subtitle': 'エンタープライズ ワークスペース',
    'login.identifier': 'メールアドレスまたはユーザー名',
    'login.identifier_placeholder': 'ユーザー名またはメールアドレス',
    'login.password': 'パスワード',
    'login.remember': 'ログイン状態を保持',
    'login.forgot': 'パスワードをお忘れですか？',
    'login.connect': '接続',
    'login.connecting': '接続中...',
    'login.secure': '安全',
    'login.logging_out': 'ログアウト中...',

    // Dashboard
    'dash.all': 'すべてのリソース',
    'dash.desktops': 'デスクトップ',
    'dash.apps': 'アプリ',
    'dash.recent': '最近 & アクティブ',
    'dash.running': '実行中',
    'dash.stopped': '停止',
    'dash.maintenance': 'メンテナンス',
    'dash.region': 'リージョン',
    'dash.launch': '起動',
    'dash.history': '履歴',
    'dash.recent_activity': '最近のアクティビティ',
    'dash.view_full': '履歴をすべて表示',
    'dash.no_active': 'アクティブなセッションはありません。',
    'dash.no_results': '検索条件に一致するアクティブなリソースはありません。',
    'dash.empty_search': 'リソースが見つかりません',
    'dash.empty_hint': '検索語句またはフィルタを調整してください。',
    'dash.sort.name': '名前順',
    'dash.sort.status': 'ステータス順',
    'dash.sort.usage': '使用率順',

    // Modal
    'modal.status': '現在のステータス',
    'modal.close': '閉じる',
    'modal.launch': 'セッション起動',

    // Settings
    'settings.title': '設定',
    'settings.tab.general': '一般',
    'settings.tab.display': 'ディスプレイ',
    'settings.tab.devices': 'デバイスと音声',
    'settings.tab.about': '情報',
    'settings.cancel': 'キャンセル',
    'settings.save': '変更を保存',

    'settings.general.title': '一般設定',
    'settings.general.launch_startup': 'スタートアップで起動',
    'settings.general.launch_startup_desc': 'ログイン時にNebulaクライアントを自動的に起動します。',
    'settings.general.auto_connect': '自動接続',
    'settings.general.auto_connect_desc': '起動時に最後に使用したリソースに自動接続します。',
    'settings.general.language': '言語',

    'settings.display.title': 'ディスプレイ設定',
    'settings.display.resolution': '解像度設定',
    'settings.display.monitors': 'すべてのモニターを使用',
    'settings.display.monitors_desc': 'リモートデスクトップをすべてのディスプレイに拡張します。',
    'settings.display.high_dpi': '高DPIスケーリング',
    'settings.display.high_dpi_desc': '高解像度ディスプレイ（Retina/4K）でのスムーズな表示を有効にします。',
    'settings.display.theme': 'テーマ',
    'settings.display.theme.dark': 'ダーク',
    'settings.display.theme.light': 'ライト',
    'settings.display.theme.system': 'システム',

    'settings.devices.title': 'デバイスと音声',
    'settings.devices.audio': 'オーディオ出力',
    'settings.devices.audio_default': 'デフォルトのシステム出力',
    'settings.devices.mic': 'マイクのパススルー',
    'settings.devices.mic_desc': 'リモートデスクトップがローカルマイクにアクセスすることを許可します。',
    'settings.devices.webcam': 'ウェブカメラのパススルー',
    'settings.devices.webcam_desc': 'リモートアプリがローカルカメラを使用することを許可します。',
    'settings.devices.usb': 'USBデバイスのリダイレクト',
    'settings.devices.usb_desc': 'ローカルUSBドライブをリモートセッションに自動的にマウントします。',

    'settings.about.version': 'バージョン',
    'settings.about.uptodate': '最新です',
    'settings.about.release_notes': 'リリースノートを表示',
    'settings.about.rights': 'All rights reserved.',

    // User Profile
    'profile.edit': 'プロフィール編集',
    'profile.save': '保存',
    'profile.pro': 'Pro',
    'profile.availability': 'ステータス',
    'profile.status.online': 'オンライン',
    'profile.status.away': '退席中',
    'profile.status.dnd': '取り込み中',
    'profile.status.offline': 'オフライン',
    'profile.department': '部署',
    'profile.location': '場所',
    'profile.email': 'メール',
    'profile.joined': '参加日',
    'profile.sessions': 'セッション数',
    'profile.usage': '使用時間',
    'profile.signout': 'サインアウト',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en-US');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};