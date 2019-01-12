{
  let view = {
    el:'.page>main',
    template:`
    <form class="form">
      <div class="row">
        <label>
        歌名
        </label>
        <input type="text" name="name" value="__name__">
      </div>
      <div class="row">
        <label>
        歌手
        </label>
        <input type="text" name="singer" value="__singer__">
      </div>
      <div class="row">
        <label>
        外链
        </label>
        <input type="text" name="link" value="__link__">
      </div>
      <div class="row actions">
        <button type="submit">保存</button>
      </div>
    </form>
    `,
    render(data={}){
      let placeHolders = 'name link singer'.split(' ')
      let html = this.template
      placeHolders.map((string)=>{
        html = html.replace(`__${string}__`,data[string]||' ')
      })
      $(this.el).html(html)
      if(data.id){
      $(this.el).prepend('<h1>编辑歌曲</h1>')
          }else{
      $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    }
  }
  let model = {
    data:{link:'',name:'',singer:'',id:''},
    save(data){
      var TestObject = AV.Object.extend('Song');
      var testObject = new TestObject();
      return testObject.save({
        name: data.name,
        link:data.link,
        singer:data.singer
      }).then((res)=>{
          return new Promise((resolve,reject)=>{
            let {id,attributes} = res
            let newsong = {id,...attributes}
            Object.assign(this.data,{id,...attributes})
            resolve(newsong)
          })
      })
    },
    modify(data){
      var song =AV.Object.createWithoutData('Song',this.data.id)

      song.set('name',data.name)

      song.set('link',data.link)

      song.set('singer',data.singer)


      return song.save().then((res)=>{
          return new Promise((resolve,reject)=>{
            let {id,attributes} = res
            let newsong = {id,...attributes}
            Object.assign(this.data,{id,...attributes})
            resolve(newsong)
          })
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model

      this.view.render()

      eventHub.on('upload',(data)=>{


        Object.assign(this.model.data,data)

        this.view.render(this.model.data)
      })

      eventHub.on('select',(data)=>{
        Object.assign(this.model.data,data)
        this.view.render(this.model.data)
      })


      this.bindEvents()

    },
    bindEvents(){
      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault()
        let needs = 'name singer link'.split(' ')
        let data = { }
        needs.map((string)=>{
          data[string] = $(this.view.el).find(`[name="${string}"]`).val()
        })
        if(this.model.data.id){
          this.modify(data)
        }else{
          this.save(data)
        }
      })
    },
    save(data){
      this.model.save(data).then((newsong)=>{
          eventHub.emit('create',JSON.parse(JSON.stringify(newsong)))
      }).then(this.view.render())

    },
    modify(data){
      this.model.modify(data).then((song)=>{
        eventHub.emit('update',JSON.parse(JSON.stringify(song)))
      }).then(this.view.render())
    }
  }
  controller.init(view,model)
}
