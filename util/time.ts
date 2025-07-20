export const formatTime = (totatlSeconds : number) : string => {
    const hours = Math.floor(totatlSeconds / 3600);
    const minutes = Math.floor((totatlSeconds % 3600) / 60);
    const seconds = totatlSeconds % 60 ;

    return [
        hours.toString().padStart(2,"0"),
        minutes.toString().padStart(2,"0"),
        seconds.toString().padStart(2,"0"),
    ].join(":")
}