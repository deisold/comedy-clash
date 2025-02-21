// import type { Provider, WebSocketProvider } from "@ethersproject/providers";
import { ComedyTheater__factory, ComedyTheater } from "./utils/types"
import { WebSocketProvider, Provider } from "ethers";
//

export type ComedyTheaterEventObserverType = {
    startObserving: () => Promise<void>;
    stopObserving: () => void;
}

export const ComedyTheaterEventObserver = (
    contractAddress: string,
    getProvider: () => Promise<Provider>
): ComedyTheaterEventObserverType => {
    var comedyTheater: ComedyTheater | null = null;

    async function startObserving() {
        console.log(`ComedyTheaterEventObserver: Starting to observe ComedyTheater events (address=${contractAddress})`);
        const provider = await getProvider();
        const comedyTheater = ComedyTheater__factory.connect(contractAddress, provider);

        const ws = (provider as WebSocketProvider).websocket as unknown as WebSocket; //
        ws.onopen = () => {
            console.log("WebSocket opened. State:", ws.readyState);

            comedyTheater.on(comedyTheater.getEvent('ShowCreated'), (address, event) => {
                console.log(`ComedyTheaterEventObserver: Show tx confirmed: ${address}`);
            });
        };
        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }
    function stopObserving() {
        console.log(`ComedyTheaterEventObserver: Stopping to observe ComedyTheater events`);
        comedyTheater?.removeAllListeners();
    }

    return {
        startObserving,
        stopObserving
    }
}