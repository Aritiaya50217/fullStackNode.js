for (let i = 0; i < 10; i++) {
    console.log(i);
}

let arr = ["a", "b", "c", "d"]
for (let i = 0; i < arr.length; i++) {
    console.log("index", i, "value : ", arr[i])
}

arr.forEach(function(item){
    console.log("use forEach : ",item)
})

arr.map(function(item){
    console.log("use map : " , item)
})