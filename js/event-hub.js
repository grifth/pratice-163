window.eventHub = {
  events:{

  },
  on(eventName,fn){
    if(this.events[eventName]===undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },
  emit(eventName,data){
    let fnList = this.events[eventName]
    fnList.map((fn)=>{
       fn.call(undefined,data)
    })
  }
}
