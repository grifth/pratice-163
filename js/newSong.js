{
  let view = {
    el:'.newSong',
    template:'新建歌曲',
    render(){
      $(this.el).html(this.template)
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      window.eventHub.on('upload',()=>{
        this.active()
      })
    },
    active(){
      $(this.view.el).addClass('active')
    }
  }
  controller.init(view,model)
}
