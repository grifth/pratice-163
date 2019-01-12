window.eventHub = {
  events:{

  },
  on(eventName,Fn){
      if(this.events[eventName]===undefined){
        this.events[eventName] = []
      }
      this.events[eventName].push(Fn)
  },
  emit(eventName,data){
    this.events[eventName].map((fn)=>{
      fn.call(undefined,data)
    })
  }
}
