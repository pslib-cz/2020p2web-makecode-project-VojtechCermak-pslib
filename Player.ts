// Add your code here
class Player
{
    _speed: number // rychlost pohybu 
    _player: Sprite; // obrázek hráče
    _attachment: Attachments//typ aktuálního přísroje na traktoru
    attachmentClass: Attachment
    
    amount: number // momentální množství 
    _maxamount: number // maximálnímožné množství
    hudSprite : Sprite // Sprite that shows HUD

    // animace chrakteru
    animLookUp: animation.Animation
    animLookDown: animation.Animation
    animLookLeft: animation.Animation
    animLookRight: animation.Animation

    /* konstruktor třídy Player
    *  na vstupu bere: speed - což je rychlost pohybu hráče
    *                  image - obrázek spritu háče
    */ 
    constructor(speed: number, image: Sprite, amounts:number)
    {

        this._maxamount = amounts
        this.amount = 0;
        this._speed = speed
        this._player = image
        this._attachment = Attachments.nonee
        if (image == Vehicles.harvester)
        {
            this.setAnimations(imagies.harvesterUp, imagies.harvesterLeft)
        }
        else
        {
            this.setAnimations(imagies.player, imagies.playerleft)
        }
        
 
    }
    get player(){return this._player} 
    set player(sprite){this._player = sprite}
    get speed(){return this._speed} 
    get attachment(){return this._attachment}
    set maxamount(value: number)
    { 
       this._maxamount = value 
    }
    get maxamount(){return this._maxamount}
    get Amount(){return this.amount}
    set Amount(value:number){this.amount = value}
    get HUD(){return this.hudSprite}
    set AttachmentClass(c: Attachment){ this.attachmentClass = c}
    get AttachmentClass(){return this.attachmentClass}

    /* přidává k množství velikost x, pokud je aktuální množství menší než maxamount
        na vstupu bere: x - množství kolik chcete přidat 
     */
    addamount(x: number)
    {
        if(this.maxamount >= this.amount && this.amount >= 0)
        {
            this.amount = this.amount + x
            return true;
        }
        return false;
    }
    
    // resetuje hodnoty množství
    resetamount()
    {
        this.maxamount = null
        this.amount = 0
    }

    // nastavuje vlasnost _attachment - nastavení vlastnosti přes set mi nefungovalo
    setAttachment(attachment: Attachments){
        this._attachment = attachment
    }

    /* funkce nastavuje animace pro pohyb charakteru
     * na vstupu bere: lookUP - Image pro pohled nahoru
     *                 lookDown - pohled dolu
    *                  lookLeft - pohled doleva
    *                  lookRight - pohled doprava
    */ 
    setAnimations( lookUP:Image, lookLeft:Image)
    {
        this.animLookUp = animation.createAnimation(ActionKind.idle_up, 100)
        animation.attachAnimation(this._player, this.animLookUp)
        this.animLookUp.addAnimationFrame(lookUP)

        this.animLookDown = animation.createAnimation(ActionKind.idle_down, 100)
        animation.attachAnimation(this._player, this.animLookDown)
        this.animLookDown.addAnimationFrame(lookUP.rotated(180))

        this.animLookLeft = animation.createAnimation(ActionKind.idle_left, 100)
        animation.attachAnimation(this._player, this.animLookLeft)
        this.animLookLeft.addAnimationFrame(lookLeft)

        this.animLookRight = animation.createAnimation(ActionKind.idle_right, 100)
        animation.attachAnimation(this._player, this.animLookRight)
        this.animLookRight.addAnimationFrame(lookLeft.rotated(180))
    }
    // funkce vytvářející HUD
    CreateHud()
    {
        if(this.maxamount != null)
        {
            this.hudSprite  = sprites.create(image.create(75, 3)) 
            this.hudSprite.setFlag(SpriteFlag.RelativeToCamera, true)
            this.hudSprite.setFlag(SpriteFlag.Ghost, true)
            this.hudSprite.image.fill(16)
            this.hudSprite.setPosition(40, 115)
        }
    }

    // funkce měnící HUD podle naplněnosti 
    ResizeHUD()
    {
        this.hudSprite.image.fill(16)
        this.hudSprite.image.fillRect(0, 0, (this.amount/this.maxamount)*75, 3, 4)
    }
}