import Acak from "./components/acak/Acak"
import Angka from "./components/angka/Angka"
import Pengurangan from "./components/pengurangan/pengurangan"
import Penjumlahan from "./components/penjumlahan/Penjumlahan"
import Perkalian from "./components/perkalian/Perkalian"
import Pembagian from "./components/pembagian/Pembagian"
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
    } else if (props.appState.view === 'acak') {
        return (
            <Acak setView={props.appState.setView} />
        )
    } else if (props.appState.view === 'pengenalan-angka') {
        return (
            <Angka setView={props.appState.setView} />
        )
    } else if (props.appState.view === 'perkalian') {
        return (
            <Perkalian setView={props.appState.setView} />
        )
    } else if (props.appState.view === 'pembagian') {
        return (
            <Pembagian setView={props.appState.setView} />
        )
    }

}

