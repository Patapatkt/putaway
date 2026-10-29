// 入出庫時間をコンポーネント化

type NewDateProps = {
    value:string;
}

export default function NewDate({
    value,
}:NewDateProps) {
    return new Date(value).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}