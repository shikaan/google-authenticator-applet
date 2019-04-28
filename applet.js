const { TextApplet } = imports.ui.applet;
const { AppletSettings } = imports.ui.settings;
const { _logError, _log, criticalNotify, notifyError, notify } = imports.ui.main;
const { spawn_command_line_sync, PRIORITY_DEFAULT, timeout_add } = imports.gi.GLib
const GTK = imports.gi.Gtk
const Gdk = imports.gi.Gdk

const spawnCommandLineSync = (command) => {
    const [success, stdout, stderr] = spawn_command_line_sync(command);

    if (!success) {
        _logError(stderr)
        notifyError(`Error while executing: ${command}. Check ~/.xsession-errors for details`)
    }

    return String(stdout).trim()
}

class GoogleAuthenticatorApplet extends TextApplet {
    _init(metadata, orientation, panel_height, instance_id) {
        super._init(orientation, panel_height, instance_id);
        this.set_applet_label('Loading...');

        this.checkDependencies();

        this.initSettings(metadata.uuid, instance_id);
        this.initClipboard()
        this.initLoop();

        this.startLoop();
    }

    on_applet_clicked() {
        this.copyCodeToClipboard();
    }

    on_applet_removed_from_panel() {
        this.stopLoop()
    }

    checkDependencies() {
        const oathtoolPath = spawnCommandLineSync('which oathtool')

        if (!oathtoolPath) {
            const message = ['Missing oathtool', 'You can install it via:\n\n\tapt-get install oathtool']
            criticalNotify(...message)
            throw new Error(message[0])
        }
    }

    initSettings(uuid, instance_id) {
        this.settings = new AppletSettings(this, uuid, instance_id);

        this.settings.bind('secret', 'secret', Function(), null);
    }

    initLoop() {
        this.isLoopStopped = false;
    }

    startLoop(interval = 2000) {
        this.getGoogleAuthenticatorCode();
        this.showGoogleAuthenticatorCode();

        if (!this.isLoopStopped) {
            timeout_add(PRIORITY_DEFAULT, interval, () => this.startLoop(interval))
        }
    }

    stopLoop() {
        this.isLoopStopped = true;
    }

    getGoogleAuthenticatorCode() {
        const googleAuthenticatorCode = spawnCommandLineSync(`oathtool --totp -b "${this.secret}"`)

        if (googleAuthenticatorCode) {
            this.googleAuthenticatorCode = googleAuthenticatorCode;
        } else {
            criticalNotify('Unable to get Code via `oathtool`', 'Try updating the secret in Settings')
        }
    }

    showGoogleAuthenticatorCode() {
        if (this.googleAuthenticatorCode)
            this.set_applet_label(this.googleAuthenticatorCode);
    }

    copyCodeToClipboard() {
        if (this.googleAuthenticatorCode) {
            this.defaultClipboard.set_text(this.googleAuthenticatorCode.toString(), 6);
            notify('Google Authenticator Code copied to clipboard')
        }
    }

    initClipboard() {
        const defaultDisplay = Gdk.Display.get_default()

        this.defaultClipboard = GTK.Clipboard.get_default(defaultDisplay)
    }
}

function main(metadata, orientation, panel_height, instance_id) {
    return new GoogleAuthenticatorApplet(metadata, orientation, panel_height, instance_id);
}