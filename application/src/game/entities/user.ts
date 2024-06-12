class User {
    private _id: string | null;
    private _token: string | null;
    private _username: string | null;
    private _email: string | null;

    public desired_level_url: string | null;

    public get is_authenticated(): boolean { return this._id === null; }

    public get id(): string { return this._id; }
    public get token(): string { return this._token; }
    public get username(): string { return this._username; }
    public get email(): string { return this._email; }

    public authenticate(id: string, token: string, username: string, email: string): boolean {
        if (this.is_authenticated) {
            return false;
        }

        this._id = id;
        this._token = token;
        this._username = username;
        this._email = email;
        // @ts-ignore
        window.api.setUserId(this._id);
        return true;
    }

    public logout() {
        this._id = null;
        this._token = null;
        this._username = null;
        this._email = null;
        localStorage.removeItem('auth_token');
    }
}

// Singleton User
// User Singleton is a Game Manager too
const user = new User();
export default user;