import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { setInterval, clearInterval } from "tns-core-modules/timer";


import { Item } from "./item";
import { ItemService } from "./item.service";

import jsSHA from "jssha";

@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit, OnDestroy {
    item: Item;
    expiry: number = 30;
    length: number = 6;
    timeRemainingCounter: any;
    countDownTimer: any;
    remainingTime: number = 0;
    progressCounter: number = 50;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.item = this.itemService.getItem(id);
        this.refreshOtp();
    }
    ngOnDestroy(): void {
        if (this.countDownTimer) { clearInterval(this.countDownTimer) }
    }

    refreshOtp = () => {
        var otpInfo = this.getOtp(this.item.secret);
        this.item.token = otpInfo.otp;
        this.item.timeRemaining = otpInfo.timeremainig;
        this.remainingTime = otpInfo.timeremainig;
        if (this.countDownTimer) { clearInterval(this.countDownTimer) }
        this.countDownTimer = setInterval(() => {
            this.remainingTime = this.remainingTime - 1;
            if (this.remainingTime <= 0) {
                var otpInfo = this.getOtp(this.item.secret);
                this.item.token = otpInfo.otp;
                this.item.timeRemaining = otpInfo.timeremainig;
                this.remainingTime = otpInfo.timeremainig;
            }
        }, 1000);
    }

    dec2hex = function (s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    hex2dec = function (s) {
        return parseInt(s, 16);
    };

    leftpad = function (s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    base32tohex = function (base32) {
        var base32chars, bits, chunk, hex, i, val;
        base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        bits = "";
        hex = "";
        i = 0;
        while (i < base32.length) {
            val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += this.leftpad(val.toString(2), 5, "0");
            i++;
        }
        i = 0;
        while (i + 4 <= bits.length) {
            chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
            i += 4;
        }
        return hex;
    };

    getOtp = function (secret, now = new Date().getTime()) {
        var epoch, hmac, key, offset, otp, shaObj, time;
        key = this.base32tohex(secret);
        epoch = Math.round(now / 1000.0);
        time = this.leftpad(this.dec2hex(Math.floor(epoch / this.expiry)), 16, "0");
        shaObj = new jsSHA("SHA-1", "HEX");
        shaObj.setHMACKey(key, "HEX");
        shaObj.update(time);
        hmac = shaObj.getHMAC("HEX");
        console.log(hmac);
        // hmacObj = new jsSHA(time, "HEX")  # Dependency on sha.js
        // hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX")
        if (hmac === "KEY MUST BE IN BYTE INCREMENTS") {
            throw "Error: hex key must be in byte increments";
        } else {
            // return null
            offset = this.hex2dec(hmac.substring(hmac.length - 1));
        }
        otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
        if (otp.length > this.length) {
            otp = otp.substr(otp.length - this.length, this.length);
        } else {
            otp = this.leftpad(otp, this.length, "0");
        }
        return { 'otp': otp, 'timeremainig': (30 - Math.floor(((new Date()).getTime() / 1000.0) % 30)) };
    };
}
