function SelectGame(props) {

    function linkPenjumlahan() {
        props.setView('penjumlahan') 
    }

    function linkPengurangan() {
        props.setView('pengurangan') 
    }
    function pengenalanAngka() {
        props.setView('pengenalan-angka') 
    }

    return (
        <div class="select-game m-auto">
            <div class="w-100 text-center p-3 bg-success mb-3">
                <h4 class="text-white fw-bold">Pilih Soal Matematika</h4>
            </div>

            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div class="col-4">
                    <a onClick={pengenalanAngka}>
                        <div class="card bg-primary text-white">
                            <h1 class="text-center">0-10</h1>
                            <div class="card-body pt-0">
                                <h4 class="text-center">Pengenalan Angka</h4>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="col-4">
                    <a onClick={linkPenjumlahan}>
                        <div class="card bg-primary text-white">
                        <h1 class="text-center">+</h1>
                        <div class="card-body pt-0">
                            <h4 class="text-center">Penjumlahan</h4>
                        </div>
                    </div>
                    </a>
                    
                </div>
                <div class="col-4">
                    <a onClick={linkPengurangan}>
                        <div class="card bg-primary text-white">
                            <h1 class="text-center">-</h1>
                            <div class="card-body pt-0">
                                <h4 class="text-center">Pengurangan</h4>
                            </div>
                        </div>
                    </a>
                    
                </div>
                <div class="col-4">
                    <div class="card bg-primary text-white">
                        <h1 class="text-center">x</h1>
                        <div class="card-body pt-0">
                            <h4 class="text-center">Perkalian</h4>
                        </div>
                    </div>
                </div>

            </div>
        
        </div>
        
    )
}
export default SelectGame;