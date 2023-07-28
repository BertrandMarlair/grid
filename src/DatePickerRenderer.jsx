import * as React from "react";
import { drawTextCell, GridCellKind } from "@glideapps/glide-data-grid";
import moment from "moment";

const useDatePickerRender = () => ({
    kind: GridCellKind.Custom,
    isMatch: (cell) => (cell.data).kind === "date-picker-cell",
    draw: (args, cell) => {
        const { displayDate } = cell.data;
        drawTextCell(args, displayDate ?? "", cell.contentAlign);
        return true;
    },
    // eslint-disable-next-line react/display-name
    provideEditor: () => p => {
        const cellData = p.value.data;
        const { format, date } = cellData;

        let val = "";
        if (date !== undefined) {
            val = date;
        }
        return (
            <input
                style={{ minHeight: 26, border: "none", outline: "none" }}
                type={format}
                autoFocus={true}
                value={val}
                onChange={e => {
                    console.log("cellData", cellData);
                    p.onChange({
                        ...p.value,
                        data: {
                            ...p.value.data,
                            date: moment(e.target.valueAsDate).format("YYYY-MM-DD") ?? cellData ?? undefined,
                            renderer: true,
                        },
                    });
                }}
            />
        );
    },
    onPaste: (v, d) => {
        return {
            ...d,
            value: v,
            pasted: true,
        };
    },
});

export default useDatePickerRender;
