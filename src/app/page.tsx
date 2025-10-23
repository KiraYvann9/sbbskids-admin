
import {LoginFormComponent} from "@/components/login/LoginFormComponent";

export default function Home() {


    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center p-24">
            <div className="w-full max-w-7xl flex rounded-xl overflow-hidden border bg-white drop-shadow-md">
                <div className="w-1/2 flex items-center justify-center bg-[#0d0f48]"></div>

                <div className="w-1/2">
                    <LoginFormComponent/>
                </div>
            </div>
        </main>
    );
}