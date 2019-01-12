{
  let view = {
    el:'#songList-container',
    template:`
    <ul class="songList">
    </ul>
    `,
    render(songs){
      $(this.el).html(this.template)
      let liList = songs.map((song)=> $('<li></li>').text(song.name).attr('data-id',song.id))
      $(this.el).find('ul').empty()
      liList.map((domLi)=>{
        $(this.el).find('ul').append(domLi)
      })
    },
    activeItem(target){
      $(target).addClass('active')
              .siblings().removeClass('active')
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data:[],
    fetchAll(){
      var query = new AV.Query('Song')
      return query.find().then((songs)=>{
           songs.map((song)=>{
             this.data.push({id:song.id,...song.attributes})
       })
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.model = model

      this.view.render(this.model.data)

      this.getAllSong()
      this.bindEvents()

      eventHub.on('upload',()=>{
        this.view.clearActive()
      })


      eventHub.on('update',(data)=>{
        let songs = this.model.data
        songs.map((song)=>{
          if(song.id == data.id){
            Object.assign(song,data)
          }
        })
        this.view.render(this.model.data)
      })

      eventHub.on('create',(data)=>{
        this.model.data.push(data)
        this.view.render(this.model.data)
      })

    },
    getAllSong(){
      this.model.fetchAll().then(()=>{
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        e.preventDefault()
        this.view.activeItem(e.currentTarget)
        let id = e.currentTarget.getAttribute('data-id')
        let songs =  this.model.data
        let formsong = {}

        songs.map((song)=>{
          if(song.id == id ){
            formsong = song
          }
        })

        window.eventHub.emit('select',formsong)

      })
    }
  }

  controller.init(view,model)
}
