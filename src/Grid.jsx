/* eslint-disable no-undef */
import React, { useEffect } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import { DropdownCell as DropdownRenderer, useExtraCells } from "@glideapps/glide-data-grid-cells";
import "@glideapps/glide-data-grid/dist/index.css";
import { data, validationIssue, columns } from "./data";
import { useUndoRedo } from "./useUndoRedo";
import useDropdownRender from "./DropDownRenderer";
import useDatePickerRenderer from "./DatePickerRenderer";
import { useLayer } from "react-laag";
import moment from "moment";

const createMeta = () => {
    let main = [];

    const mainColumn = "lineId";

    const lineIdIndex = columns.findIndex((e) => e.title === mainColumn);

    for (let i = 0; i < data.length; i ++) {
        const validations = validationIssue.filter((e) => e.lineId === parseInt(data[i][lineIdIndex]));

        main.push(columns.map((col, colIndex) => {
            return {
                value: data[i][colIndex],
                column: col,
                validations: validations.filter((e) => e.columnName === col.title),
            }
        }))
    }

    return main;
}

const meta =  createMeta();

const Grid = () => {
    const cellProps = useExtraCells();
    const dropdownRender = useDropdownRender();
    const datePickerRenderer = useDatePickerRenderer();

    const defaultZeroBounds = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0,
    };

    const dataRef = React.useRef(data);
    const metaRef = React.useRef(meta);
    const zeroBoundsRef = React.useRef(defaultZeroBounds);
    const saveRef = React.useRef([...new Array(dataRef.current.length).fill(null).map((e) => new Array(dataRef.current[0].length).fill(null))]);
    const timeoutRef = React.useRef(0);

    const getCellContent = React.useCallback((cell) => {
        const [col, row] = cell;
        const d = dataRef.current[row][col];
        const column = columns[col];

        let type = 0; // 0 default 1 edited 2 validation 3 error 

        if (saveRef.current[row][col]) {
            type = 1
        }

        const wait = ms => new Promise(r => setTimeout(r, ms));

        const defaultData = {
            meta: metaRef.current[row][col],
            allowOverlay: true,
            defaultData: d,
            copyData: d,
            displayData: d,
            themeOverride: {
                textDark: "#FF0000",
                bgCell: "#e8e9eb",
                borderColor: '#ffff00',
            }
        }

        if (row >= 0 && row <= 1 && col >= 0 && col <= 4) {
            return {
                kind: GridCellKind.Text,
                ...defaultData,
                allowOverlay: false,
                data: "Span Cell that is very long and will",
                span: [0, 1],
                displayData: "Span Cell that is very long and will",
                contentAlign: "center",
                themeOverride: {
                    bgCell: "#fff",
                }
            };
        }

        if (column.dataType === "Code") {
            return {
                kind: GridCellKind.Custom,
                ...defaultData,
                type,
                data: {
                    kind: "dropdown-cell",
                    allowedValues: ["A", "B", "C"],
                    asyncAllowedValues: async () => {
                        await wait(2000);

                        return ["A", "B", "C"];
                    },
                    value: d,
                },
            };
        }

        if (column.dataType === "Integer") {
            if (isNaN(d)) {
                type = 2;
            }
            return {
                kind: GridCellKind.Text,
                ...defaultData,
                data: d,
                type,
            };
        }

        if (column.dataType === "Star") {
            return {
                kind: GridCellKind.Custom,
                ...defaultData,
                type,
                data: {
                    kind: "star-cell",
                    label: "Test",
                    rating: parseInt(d),
                },
            }
        }

        if (column.dataType === "Date") {
            let date, displayDate, copyData, currentValue, value;
            if(!isNaN(new Date(d).getTime())) {
                currentValue = new Date(d);
                date = moment(currentValue).format("YYYY-MM-DD");
                displayDate = moment(currentValue).format("DD/MM/YYYY");
                value = moment(currentValue).format("YYYY-MM-DD")
                copyData = moment(currentValue).format("YYYY-MM-DD")
            } else {
                if (d !== "") {
                    type = 2
                }
                date = new Date();
                displayDate = d;
                value = d;
                copyData = d;
            }

            return {
                kind: GridCellKind.Custom,
                ...defaultData,
                copyData,
                type,
                data: {
                    kind: "date-picker-cell",
                    date,
                    value,
                    displayDate,
                    format: "date",
                    d,
                },
            }
        }
        
        return {
            kind: GridCellKind.Text,
            ...defaultData,
            data: d,
            type: 1,
        };
    }, []);

    useEffect(() => {
        window.clearTimeout(timeoutRef.current)
    }, []);

    const _onCellEdited = React.useCallback((cell, newValue) => {
        const [col, row] = cell;

        if (newValue.kind === "delete"){
            dataRef.current[row][col] = "";
        } else
        if (newValue.kind === GridCellKind.Custom){
            if (newValue?.data?.kind === "star-cell") {
                dataRef.current[row][col] = newValue?.data?.rating.toString();
            } else
            if (newValue?.data?.kind === "date-picker-cell" || newValue?.data?.data?.kind === "date-picker-cell") {
                if (newValue?.data?.renderer) {
                    if(!isNaN(new Date(newValue?.data?.date).getTime())) {
                        dataRef.current[row][col] = moment(newValue?.data?.date).format("MM-DD-YYYY");
                    } else {
                        dataRef.current[row][col] = newValue?.data?.value;
                    }
                } else {
                    dataRef.current[row][col] = newValue?.data?.value ?? newValue.data;
                }
            } else
            if (newValue?.data?.kind === "dropdown-cell") {
                dataRef.current[row][col] = newValue?.data?.value?.toString();
            } else
            if (DropdownRenderer.isMatch(newValue)) {
                dataRef.current[row][col] = newValue.data.value;
            }
        } else {
            dataRef.current[row][col] = newValue.data;
        };

        if (metaRef.current[row][col].value !== dataRef.current[row][col]) {
            saveRef.current[row][col] = {cell, newValue: dataRef.current[row][col], old: metaRef.current[row][col].value};
        } else {
            saveRef.current[row][col] = null;
        }
    }, []);

    const gridRef = React.useRef(null);
    const { gridSelection, onCellEdited, onGridSelectionChange } = useUndoRedo(gridRef, getCellContent, _onCellEdited);
    
    const [tooltip, setTooltip] = React.useState();
    const [lockTooltip, setLockTooltip] = React.useState(false);

    const onItemHovered = React.useCallback((args) => {
        if (lockTooltip) {
            return
        }

        if (args.kind === "cell") {
            const row = args.location[1]
            const col = args.location[0]
            const currentCell = metaRef.current[row][col];

            window.clearTimeout(timeoutRef.current);
            setTooltip(undefined);
            if (currentCell?.validations?.length > 0) {
                timeoutRef.current = setTimeout(() => {

                    const bounds = {
                        left: args.bounds.x,
                        top: args.bounds.y,
                        width: args.bounds.width,
                        height: args.bounds.height,
                        right: args.bounds.x + args.bounds.width,
                        bottom: args.bounds.y + args.bounds.height,
                    };

                    zeroBoundsRef.current = bounds;

                    setTooltip({
                        val: `Tooltip for ${args.location[0]}, ${args.location[1]}`,
                        bounds,
                        currentCell,
                    });
                }, 100);
            }
        } else {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
            setTooltip(undefined);
        }
    }, [lockTooltip]);

    const isOpen = lockTooltip || tooltip !== undefined;
    const { renderLayer, layerProps } = useLayer({
        isOpen,
        auto: true,
        placement: "right-start",
        triggerOffset: -13,
        container: "portal",
        containerOffset: 16,
        trigger: {
            getBounds: () => tooltip?.bounds ?? zeroBoundsRef.current,
        },
    });

    const handleCloseTootip = () => {
        setLockTooltip(false);
        setTooltip(undefined);
    }

    const getCellsForSelection = React.useCallback(
        (selection) => {
            const result = [];

            for (let y = selection.y; y < selection.y + selection.height; y++) {
                const row = [];
                for (let x = selection.x; x < selection.x + selection.width; x++) {
                    row.push(getCellContent([x, y]));
                }
                result.push(row);
            }

            return result;
        },
        [getCellContent]
    );

    return (
        <div className="grid">
            <DataEditor
                {...cellProps}
                theme={{
                    borderColor: "transparent",
                    // bgColor: "#00ff00",
                    // bgCell: "#00ffff"
                }}
                onDelete={(e) => {
                    console.log("e", e);
                    let range;
                    if (e.columns.items.length === 1) {
                        const [from, to] = e.columns.items[0];
                        range = {x: from, y: 0, width: to - from, height: dataRef.current.length}
                    } else
                    if (e.rows.items.length === 1) {
                        const [from, to] = e.rows.items[0];
                        range = {x: 0, y: from, width: dataRef.current[0].length, height: to - from}
                    } else {
                        range = e.current.range;

                    }

                    const {x, y, width, height} = range;

                    for (let i = x; i < width + x; i++) {
                        if (columns[i].custom) {
                            for (let j = y; j < height + y; j++) {
                                onCellEdited([i, j], {...metaRef.current[j][i], kind: "delete"})
                            }
                        }
                    }
                }}
                ref={gridRef}
                getCellContent={getCellContent}
                onCellEdited={onCellEdited}
                columns={columns}
                rows={dataRef.current.length}
                gridSelection={gridSelection ?? undefined}
                onGridSelectionChange={onGridSelectionChange}
                rowMarkers="both"
                onItemHovered={onItemHovered}
                onPaste={true}
                getCellsForSelection={getCellsForSelection}
                rowHeight={25}
                freezeColumns={2}
                smoothScrollX={true}
                smoothScrollY={true}
                fillHandle={true}
                keybindings={{
                    clear: true,
                    copy: true,
                    downFill: true,
                    rightFill: true,
                    pageDown: true,
                    pageUp: true,
                    paste: true,
                    search: true,
                    selectAll: true,
                    selectColumn: true,
                    selectRow: true,
                }}
                drawCell={args => {
                    const { cell, rect, ctx, highlighted } = args;
                    let bgColor = "#fff"
                    let hlColor = "#ebf1ff"

                    const { x, y, width, height } = rect;

                    ctx.save();

                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x + 1, y + 1, width - 1, height - 1);

                    // ctx.shadowColor = "#d53";
                    // ctx.shadowBlur = 2;
                    // ctx.lineJoin = "bevel";
                    // ctx.lineWidth = 1;
                    // ctx.strokeStyle = "#38f";
                    // ctx.strokeRect(x + 1, y, width - 1, height + 1);
                    // console.log("args", args);

                    // ctx.fillRect(x - (2), y - (2), width + (2 * 2), height + (2 * 2));

                    console.log("cell", cell);
                    if (cell.type !== 0) {
                        // console.log("args", args);
                        if (cell.type === 1) {
                            bgColor = "#bfffcd"
                            hlColor = "#bfffee"
                        } else if (cell.type === 2) {
                            bgColor = "#ff000094"
                            hlColor = "#ff0000c4"
                        } else if (cell.type === 3) {
                            bgColor = "#fff700c4"
                            hlColor = "#fff7007d"
                        } else if (cell.type === 4) {
                            bgColor = "#ff4e00c2"
                            hlColor = "#ff4e007d"
                        }

                        // const { x, y, width, height } = rect;
                    };

                    if (highlighted) {
                        bgColor = hlColor;
                    }

                    ctx.fillStyle = bgColor;
                    ctx.fillRect(x + 1, y + 1, width - 1, height - 1);

                    if (cell.meta?.validations.length > 0) {
                        // bgColor = "#0000cd"
                        // hlColor = "#0000ee"

                        const size = 10;
                        ctx.beginPath();
                        ctx.moveTo(x + width, y);
                        ctx.lineTo(x + width, y + size);
                        ctx.lineTo(x + width - size, y);
                        ctx.fillStyle ="#4f5dff";
                        ctx.fill();
                        // ctx.fill(x + 1, y + 1, width - 1, height - 1);
                    }

                    ctx.restore();
                }}
                customRenderers={[
                    dropdownRender,
                    datePickerRenderer,
                    ...cellProps.customRenderers,
                ]}
            />
            {isOpen &&
                renderLayer(
                    <div
                        {...layerProps}
                        onMouseEnter={() => setLockTooltip(true)}
                        onMouseLeave={() => handleCloseTootip()}
                        style={{
                            ...layerProps.style,
                            padding: "8px 12px",
                            background: "white",
                            fontSize: "0.8rem",
                            maxWidth: 260,
                            boxSizing: 'initial',
                            maxHeight: 200,
                            overflow: "auto",
                            pointerEvents: "all",
                            border: "2px solid grey",
                        }}>
                        {tooltip?.currentCell?.validations.map((validation, validationKey) => {
                            return (
                                <div key={`validation/${validationKey}`}>
                                    <h3>{validation.beCrisId}</h3>
                                    <p>{validation.messageDesc}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
        </div>
    )
}

export default Grid;

// span cell
