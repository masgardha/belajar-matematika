import Pengurangan from "./components/pengurangan/pengurangan"
import Penjumlahan from "./components/penjumlahan/Penjumlahan"
import SelectGame from "./components/select-game/SelectGame"

export default function RenderPage(props) {
    if (props.appState.view === 'mainMenu') {
        return(
            <SelectGame setView={props.appState.setView} />

        )
        
    } else if (props.appState.view === 'penjumlahan') {
        return (
            <Penjumlahan setView={props.appState.setView} />
        )
    } else if (props.appState.view === 'pengurangan') {
        return (
            <Pengurangan setView={props.appState.setView} />
        )
    }
}

