

export default function DifferenceBadge({diff}){
    const badgeClass = parseFloat(diff) < 0 ? "diff--badge--red" : "diff--badge--green";
    const text =  diff ? parseFloat(diff) < 0 ? `(${diff})` : `(+${diff})` : ''
    return(
        < div className={`diff--badge ${badgeClass}`}> {text }</div >
    )
}