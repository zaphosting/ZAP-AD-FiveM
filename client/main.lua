local nuiLoaded = false
local cursorInUse = false
local _SendNUIMessage = SendNUIMessage

function SendNUIMessage(message)
    while not nuiLoaded do
        Wait(0)
    end
    _SendNUIMessage(message)
end

RegisterNUICallback("loaded", function(_, cb)
    nuiLoaded = true
    cb("OK")
end)

RegisterNUICallback("clicked", function(_, cb)
    cursorInUse = false
    SetNuiFocus(cursorInUse, cursorInUse)
    cb("OK")
end)

CreateThread(function()
    SendNUIMessage({ config = Config })

    while true do
        SendNUIMessage({ show = true })
        Wait(Config.timeToDisplay * 1000)
        SendNUIMessage({ hide = true })
        Wait(Config.timeBetweenEachDisplay * 1000)
    end
end)

CreateThread(function()
    while true do
        if IsControlJustPressed(0, Config.key) then
            cursorInUse = not cursorInUse
            SetNuiFocus(cursorInUse, cursorInUse)
        end

        Wait(0)
    end
end)
