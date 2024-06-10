import Phaser from "phaser";
import * as settings from "../../settings";
import user from "../entities/user";

interface LoginProps {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    }
}

interface LoginTokenProps {
    id: string;
    username: string;
    email: string;
}

export class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoginScene" });
    }

    preload(): void {
        this.load.html('loginTemplate', 'src/templates/login.html');
    }

    create(): void {
        const auth_token = localStorage.getItem('auth_token');
        if (auth_token) {
            fetch(`${settings.API_BASE_URL}/api/auth/login/token/`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${auth_token}`
                }
            })
            .then(result => {
                if (!result.ok) {
                    throw new Error('Error while fetching auth api.')
                }
                return result.json();
            })
            .then(data => {
                const login_data = data as LoginTokenProps;
                if (user.authenticate(login_data.id, auth_token, login_data.username, login_data.email)) {
                    localStorage.setItem('auth_token', auth_token);
                    this.scene.start('PreloadScene');
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
        else {
            const X = this.cameras.main.width;
            const Y = this.cameras.main.height;
            const centerX = X / 8.3;
            const centerY = Y / 15;

            const element = this.add.dom(centerX, centerY).createFromCache('loginTemplate');
            element.node.classList.add("h-full", "w-full");

            const loginContainer = document.getElementById("loginContainer");
            if (loginContainer) {
                loginContainer.style.position = "absolute";
                loginContainer.style.top = "50%";
                loginContainer.style.left = "50%";
                loginContainer.style.transform = "translate(-50%, -50%)";
            }

            document.getElementById("loginSubmit")?.addEventListener("click", async (event: MouseEvent) => {
                event.preventDefault();
                const username = (document.getElementById("username") as HTMLInputElement).value;
                const password = (document.getElementById("password") as HTMLInputElement).value;

                try {
                    const response = await fetch(`${settings.API_BASE_URL}/api/auth/login/`, {
                        method: "POST",
                        body: JSON.stringify({
                            username: username,
                            password: password
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Error response data:", errorData);
                        throw new Error("Error while fetching auth API.");
                    }
                    const data: LoginProps = await response.json();
                    if (user.authenticate(data.user.id, data.token, data.user.username, data.user.email)) {
                        localStorage.setItem('auth_token', user.token);
                        this.scene.start("PreloadScene");
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }

    update(time: number, delta: number): void {

    }
}
