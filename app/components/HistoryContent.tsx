import { getHistories } from "@/lib/getHistories";
import HistoryTable from "./HistoryTable";

// 履歴を取得し、表示用コンポーネントへ渡す
export default async function HistoryContent() {
    const histories = await getHistories();

    return <HistoryTable histories={histories} />;
}