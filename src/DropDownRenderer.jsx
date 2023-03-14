import { GridCellKind, getMiddleCenterBias, useTheme } from "@glideapps/glide-data-grid";
import { styled } from "@linaria/react";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";

const CustomMenu = p => {
    const { Menu } = components;
    const { children, ...rest } = p;
    return <Menu {...rest}>{children}</Menu>;
};

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .glide-select {
        font-family: var(--gdg-font-family);
        font-size: var(--gdg-editor-font-size);
    }
`;

const PortalWrap = styled.div`
    font-family: var(--gdg-font-family);
    font-size: var(--gdg-editor-font-size);
    color: var(--gdg-text-dark);

    > div {
        border-radius: 4px;
        border: 1px solid var(--gdg-border-color);
    }
`;

const Editor = ({ value: cell, onFinishedEditing, initialValue }) => {
    const { asyncAllowedValues, allowedValues, value: valueIn } = cell.data;

    const [asyncValues, setAsyncValues] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // You can await here
            const response = await asyncAllowedValues();

            setLoading(false);
            console.log("response", response);

            setAsyncValues(response);

        }
        fetchData();

    }, [asyncAllowedValues]);

    const [value, setValue] = React.useState(valueIn);
    const [inputValue, setInputValue] = React.useState(initialValue ?? "");

    const theme = useTheme();

    const values = React.useMemo(
        () =>
        (asyncValues || allowedValues).map(x => ({
                value: x,
                label: x,
            })),
        [asyncValues, allowedValues]
    );

    return (
        <Wrap>
            <Select
                className="glide-select"
                inputValue={inputValue}
                onInputChange={setInputValue}
                menuPlacement={"auto"}
                value={values.find(x => x.value === value)}
                styles={{
                    control: base => ({
                        ...base,
                        border: 0,
                        boxShadow: "none",
                    }),
                }}
                theme={t => {
                    return {
                        ...t,
                        colors: {
                            ...t.colors,
                            neutral0: theme.accentFg, // this is both the background color AND the fg color of
                            // the selected item because of course it is.
                            neutral5: theme.accentFg,
                            neutral10: theme.accentFg,
                            neutral20: theme.bgCellMedium,
                            neutral30: theme.bgCellMedium,
                            neutral40: theme.bgCellMedium,
                            neutral50: theme.textLight,
                            neutral60: theme.textMedium,
                            neutral70: theme.textMedium,
                            neutral80: theme.textDark,
                            neutral90: theme.textDark,
                            neutral100: theme.textDark,
                            primary: theme.accentColor,
                            primary75: theme.accentColor,
                            primary50: theme.accentColor,
                            primary25: theme.accentLight, // prelight color
                        },
                    };
                }}
                isLoading={loading}
                menuPortalTarget={document.getElementById("portal")}
                autoFocus={true}
                openMenuOnFocus={true}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    Menu: props => (
                        <PortalWrap>
                            <CustomMenu className={"click-outside-ignore"} {...props} />
                        </PortalWrap>
                    ),
                }}
                options={values}
                onChange={async e => {
                    if (e === null) return;
                    setValue(e.value);
                    await new Promise(r => window.requestAnimationFrame(r));
                    onFinishedEditing({
                        ...cell,
                        data: {
                            ...cell.data,
                            value: e.value,
                        },
                    });
                }}
            />
        </Wrap>
    );
};

const useDropdownRender = () => ({
    kind: GridCellKind.Custom,
    isMatch: (c) => (c.data).kind === "dropdown-cell",
    draw: (args, cell) => {
        const { ctx, theme, rect } = args;
        const { value } = cell.data;
        ctx.fillStyle = theme.textDark;
        ctx.fillText(
            value,
            rect.x + theme.cellHorizontalPadding,
            rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
        );

        return true;
    },
    provideEditor: () => ({
        editor: Editor,
        // disablePadding: true,
        deletedValue: v => {
            console.log("v", v);
            return {
                ...v,
                copyData: "",
                data: {
                    ...v.data,
                    value: "",
                },
            }
        },
    }),
    // onPaste: (v, d) => ({
    //     ...d,
    //     value: d.allowedValues.includes(v) ? v : d.value,
    // }),
    onPaste: (v, d) => {
        console.log("onPaste", v, d);
        return {
            ...d.data,
            value: v,
        }
    },
    onDelete: v => {
        console.log("onDelete", v);
    },
});

export default useDropdownRender;