import {useState} from "react";

export function Alert(type = "infornation ", heading, childern){
    return(
        <div>
            <div>
            <span {type === "warning"? "Worning" : "Information"}>
                {type === `warning`? `!` : `i`}
            </span>
            <span>{heading}</span>
            </div>
            <div>{childern}</div>
        </div>
    )
}