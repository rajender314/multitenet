import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const app = window['appSettings'];

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    app=app;
    constructor(private http: HttpClient) {
        
    }

    getClientAccounts() {
        let path = app.base_url + 'getClientUserAccounts';
        let body = {
            client_id: app.default_client.id,
            user_id: app.user.id
        };
        return this.http.post<any>(path, body);
    }

    getClientList() {
        let path = app.base_url + 'getUserClientList';
        return this.http.get<any>(path, { params: { user_id: app.user.id } });
    }
}