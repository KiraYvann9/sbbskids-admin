import { toast } from "react-hot-toast";
import React from "react";

export class ToastCustom {
  // Custom toast implementation

    static success(message: string) {
        toast.success(message, {
            duration: 5000,
        });

    }

    static error(message: string) {
        toast.error(message, {
            duration: 5000,
            
        });
    }
}