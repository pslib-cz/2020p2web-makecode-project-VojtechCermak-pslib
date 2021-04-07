/*
 * V1.0 - beta
 * správně nastavit hodnoty//
 * realná mapa
 * V1.1 
 * různě plná vlečka
 * řeky a křižovatka
 * V1.2
 * městečka
 * V1.3
 * benzín
 * V1.5
 * obchod
 */  
// namespace s grafikou
namespace imagies{
    export const player =assets.image`TRAKTORup`
    export const playerleft = player.rotated(270)

    export const harvesterUp = assets.image`harvesterUP`
    export const harvesterLeft = harvesterUp.rotated(-90)

    export const sazecUp = assets.image`sazecUP`
    export const sazecleft = assets.image`sazecLeft`

    export const kultivatorUp = assets.image`TsKup`
    export const kultivatorleft = assets.image`TsKleft`

    export const flatbedUp = assets.image`TsvleckaUP`
    export const flatbedLeft = assets.image`TsvleckaLeft`
    
    export const sazec = assets.image`sazec`
    export const kultivator = assets.image`kultivator`
    export const flatbed =assets.image`vlecka`

    export const level1Background = assets.tile`myTile10`
    export const field = assets.tile`Polenezorane`
    export const fieldplowed = assets.tile`Polezorane`
    export const fielddone = assets.tile`Polenezasazene`
    export const fieldHalfGrown = assets.tile`halfgrown`
    export const fieldGrown = assets.tile`fullgrown`
}
// speciální možnosti SpriteKind
namespace SpriteKind{
    export const kultivator = SpriteKind.create();
    export const sazec = SpriteKind.create();
    export const flatbed = SpriteKind.create();
    export const tractor = SpriteKind.create();
    export const harvester = SpriteKind.create();
}

namespace Vehicles
{
    export let tractor = sprites.create(imagies.player, SpriteKind.Player)
    export let harvester = sprites.create(imagies.harvesterUp, SpriteKind.Player)
}

// možnosti oroentace 
enum ActionKind {
    Idle,
    idle_down,
    idle_up,
    idle_right,
    idle_left
}

// možnost připojitelných zařízení
enum Attachments
{
    nonee,
    kultivator,
    sazec,
    flatbed
}

scene.setBackgroundColor(15)
tiles.setTilemap(tilemap`level1`)
let vehicleList = [new Player(10, Vehicles.tractor, null),new Player(10, Vehicles.harvester, 50)]; // list všech používaných vozidel
let attachmentList : Array<Attachment> // seznam zařízení 
attachmentList = []
let vehicle = 0; // index momentálního vozidla
controller.moveSprite(vehicleList[vehicle].player)
scene.cameraFollowSprite(vehicleList[vehicle].player)
Vehicles.harvester.setPosition(100, 100)// nastavení počáteční pozice
info.setScore(10) // nastavení počátečního množství peněz


// vytváření spritů
CreateSprites(assets.tile`sazec background`, imagies.sazec, imagies.level1Background , SpriteKind.sazec, 50)
CreateSprites(assets.tile`kultivatorBackground`, imagies.kultivator, imagies.level1Background,SpriteKind.kultivator, null)
CreateSprites(assets.tile`VleckaBackground`,imagies.flatbed ,imagies.level1Background , SpriteKind.flatbed, 100)
//CreateSprites(assets.tile`harvesterBackground`,imagies.harvesterUp ,imagies.level1Background , SpriteKind.Player)

vehicleList[vehicle].player.say("B is for changing vehicles", 5000)
attachmentList[0].sprite.say("A is for connecting and disconnecting equipments", 10000)

// na update změní orientaci hráče podle toho na kterou stranu se pohybuje a updatuje HUD
game.onUpdate(function() {
    if(controller.down.isPressed())
    {
       animation.setAction(vehicleList[vehicle].player, ActionKind.idle_down)
    }
    if(controller.up.isPressed())
    {
       animation.setAction(vehicleList[vehicle].player, ActionKind.idle_up)
    }
    if(controller.left.isPressed())
    {
       animation.setAction(vehicleList[vehicle].player, ActionKind.idle_left)
    }
    if(controller.right.isPressed())
    {
       animation.setAction(vehicleList[vehicle].player, ActionKind.idle_right)
    }
    if(vehicleList[vehicle].HUD){
        vehicleList[vehicle].ResizeHUD()
    }
    if(info.score() <= 0){
        game.over(false)
    }
})

/*pokud je zmáčknuto A */
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    /*pokud je k vozildu připojeno nejaké zařízeí tak se odpojí */
    if (vehicleList[vehicle].attachment == Attachments.sazec )
    {
        Detach(imagies.sazec, SpriteKind.sazec)
        return
    }
    if( vehicleList[vehicle].attachment == Attachments.kultivator )
    {
        Detach(imagies.kultivator, SpriteKind.kultivator)
        return
    }
    if( vehicleList[vehicle].attachment == Attachments.flatbed )
    {
        Detach(imagies.flatbed, SpriteKind.flatbed)
        return
    } 
    /*Pokud je vozidlo traktor a nemá nic připojeného tak přopojí to s čím se překrývá, pokud se překrývá*/
    if(vehicleList[vehicle].player == Vehicles.tractor && vehicleList[vehicle].attachment == Attachments.nonee)
    {
        for (let i = 0; i < attachmentList.length; i++)
        {
            if (vehicleList[vehicle].player.overlapsWith(attachmentList[i].sprite))
            {
                Attach(i);
                break
            }
        }  
    }
    else
    {
        for (let i = 0; i < attachmentList.length; i++)
        {
            // pokud je nástroj s kterým se překrývá vlečka a vozidlo není traktor tak vlečce předá to co má ve skladu
            if (vehicleList[vehicle].player.overlapsWith(attachmentList[i].sprite))
            {
                if(attachmentList[i].amount + vehicleList[vehicle].amount <= attachmentList[i].maxAmount)
                {
                    attachmentList[i].amount += vehicleList[vehicle].amount
                    vehicleList[vehicle].amount = 0
                    break;
                }
                else
                {
                    vehicleList[vehicle].amount -= (attachmentList[i].maxAmount-attachmentList[i].amount)
                    attachmentList[i].amount = attachmentList[i].maxAmount
                }
            }
        }
    }
})

// měnění vozidel
/* pokud je zmáčknuto B změní se vozidlo na jiné*/
controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
    if(vehicleList[vehicle].attachment == Attachments.nonee)
    {
        vehicleList[vehicle].player.destroy()
        if(vehicleList[vehicle].player == Vehicles.harvester)
        {
            vehicleList[vehicle].HUD.destroy()
            Vehicles.harvester = sprites.create(imagies.harvesterUp, SpriteKind.Player)
            Vehicles.harvester.setPosition(vehicleList[vehicle].player.x, vehicleList[vehicle].player.y)
            vehicleList[vehicle].player = Vehicles.harvester
            vehicleList[vehicle].setAnimations(imagies.harvesterUp,imagies.harvesterLeft)
        }
        else
        {   
            Vehicles.tractor = sprites.create(imagies.player, SpriteKind.Player)
            Vehicles.tractor.setPosition(vehicleList[vehicle].player.x, vehicleList[vehicle].player.y)
            vehicleList[vehicle].player = Vehicles.tractor
            vehicleList[vehicle].setAnimations(imagies.player, imagies.playerleft)
        }
        if(vehicleList.length == vehicle + 1)
        {
            vehicle = 0;
        }
        else
        {
            vehicle ++;
        }
        controller.moveSprite(vehicleList[vehicle].player)
        scene.cameraFollowSprite(vehicleList[vehicle].player)
        vehicleList[vehicle].CreateHud()
    }
})

/* pokud se hráč octne na poli s obrázkem imagies.field
   field a má připojený kultivator tak se pole změní na fieldplowed*/
scene.onOverlapTile(SpriteKind.Player, imagies.field, function(sprite: Sprite, location: tiles.Location) {
    if (vehicleList[vehicle].attachment == Attachments.kultivator)
    {
        tiles.setTileAt(location, imagies.fieldplowed)
    }
})
/* pokud se hráč octne na poli s obrázkem imagies.field
   field a má připojený kultivator tak se pole změní na fielddone*/
scene.onOverlapTile(SpriteKind.Player, imagies.fieldplowed, function(sprite: Sprite, location: tiles.Location) {
    if (vehicleList[vehicle].attachment == Attachments.sazec)
    {
        if(vehicleList[vehicle].addamount(-1))
        {
            tiles.setTileAt(location, imagies.fielddone)
        }
    }
})

/*d pokud se hráč octne na poli s obrázkem imagies.fieldGrown
   a je harvester tak se pole změní na field*/
scene.onOverlapTile(SpriteKind.Player, imagies.fieldGrown, function(sprite: Sprite, location: tiles.Location) {
    if (vehicleList[vehicle].player == Vehicles.harvester)
    {
        if(vehicleList[vehicle].addamount(1))
        {
            tiles.setTileAt(location, imagies.field)
        }
    }
})

// pokud je traktor s Attachments.sazec na poli assets.tile`Addseeds`tak se sázeči doplní semena
scene.onOverlapTile(SpriteKind.Player,assets.tile`Addseeds`, function(sprite: Sprite, location: tiles.Location) {
    if (vehicleList[vehicle].attachment == Attachments.sazec)
    {
        info.changeScoreBy(-(vehicleList[vehicle].maxamount-vehicleList[vehicle].amount))
        vehicleList[vehicle].amount = vehicleList[vehicle].maxamount
    }
})

// pokud je traktor s Attachments.flatbed na poli assets.tile`myTile0`tak se prodá obsah vlečky
scene.onOverlapTile(SpriteKind.Player,assets.tile`myTile0`, function(sprite: Sprite, location: tiles.Location) {
    if (vehicleList[vehicle].attachment == Attachments.flatbed)
    {
        info.changeScoreBy(vehicleList[vehicle].amount*2)
        vehicleList[vehicle].amount = 0
    }
})

// po uplintí určeného času se fielddone změní na fieldHalfGrown
game.onUpdateInterval(120000, function() {
    for(let value of tiles.getTilesByType(imagies.fielddone))
    {
        tiles.setTileAt(value,imagies.fieldHalfGrown)
    }
})
// po uplintí určeného času se fieldHalfGrown změní na fieldGrown
game.onUpdateInterval(240000, function() {
    for(let value of tiles.getTilesByType(imagies.fieldHalfGrown))
    {
        tiles.setTileAt(value,imagies.fieldGrown)
    }
})


// funkce
/* funkce vytváří objekty a nic nevrací
 * na vstupu bere: oldTile - placeholder na místě na kterém chcete vytvořit sprite
 *                 spriteImg - obrázek jak má sprie vypdat
 *                 newTile - pozadí daného spritu
*/
function CreateSprites( oldTile: Image, spriteImg: Image, newTile:Image, spriteKind: number, maxAmount: number) 
{
    for(let value of tiles.getTilesByType(oldTile))
    {
    let newAttachment = new Attachment(spriteKind, spriteImg, maxAmount)
    attachmentList.push(newAttachment)
    tiles.placeOnTile(newAttachment.sprite, value)
    tiles.setTileAt(value,newTile)
    }
}

/*funkce připojuje daný Attachment
 * na vstupu bere: otherSprite - což je sprite který se má připojit
*/
function Attach( i:number)
{
    vehicleList[vehicle].maxamount = attachmentList[i].maxAmount
    vehicleList[vehicle].Amount = attachmentList[i].amount
    vehicleList[vehicle].CreateHud()
    vehicleList[vehicle].attachmentClass = attachmentList[i]
    if(attachmentList[i].sprite.kind() == SpriteKind.kultivator)
    {
        vehicleList[vehicle].setAnimations(imagies.kultivatorUp, imagies.kultivatorleft)
        vehicleList[vehicle].setAttachment(Attachments.kultivator)
    }
    else if(attachmentList[i].sprite.kind() == SpriteKind.flatbed)
    {
        vehicleList[vehicle].setAnimations(imagies.flatbedUp, imagies.flatbedLeft)
        vehicleList[vehicle].setAttachment(Attachments.flatbed)
    }
    else if(attachmentList[i].sprite.kind() == SpriteKind.sazec)
    {
        vehicleList[vehicle].setAnimations(imagies.sazecUp, imagies.sazecleft)
        vehicleList[vehicle].setAttachment(Attachments.sazec)   
    }
    attachmentList[i].sprite.destroy()
}

/* funkce odpojuje připojený Attachment
 * na vstupu bere: spriteImage - obrázek samostatného spritu
 *                 kind - SpriteKind daného obrázku
*/
function Detach(spriteImage: Image, kind: number)
{
    vehicleList[vehicle].setAnimations(imagies.player, imagies.playerleft,)
    vehicleList[vehicle].attachmentClass.sprite = null
    // prochází polem attachmentů a hledá který je Null 
    // po jeho nalezení ho nastaví na příslušný obrázek a nastaví mu správné souřadnice a přenese do něj jeho naplněnost
    for (let i = 0; i < attachmentList.length; i++)
    {
        if(attachmentList[i].sprite == null)
        {
            attachmentList[i].sprite = sprites.create(spriteImage, kind)
            attachmentList[i].sprite.setPosition(vehicleList[vehicle].player.x, vehicleList[vehicle].player.y)
            attachmentList[i].amount = vehicleList[vehicle].amount
            break
        }
    }
    vehicleList[vehicle].setAttachment(Attachments.nonee)
    vehicleList[vehicle].resetamount()
    // pokud je aktivní HUD tak ho zničí
    if(vehicleList[vehicle].HUD != undefined)
    {
        vehicleList[vehicle].HUD.destroy()
    }
}