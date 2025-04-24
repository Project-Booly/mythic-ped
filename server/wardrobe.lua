AddEventHandler("Wardrobe:Shared:DependencyUpdate", RetrieveWardrobeComponents)
function RetrieveWardrobeComponents()
	Chat = exports["mythic-base"]:FetchComponent("Chat")
	Fetch = exports["mythic-base"]:FetchComponent("Fetch")
	Callbacks = exports["mythic-base"]:FetchComponent("Callbacks")
	Middleware = exports["mythic-base"]:FetchComponent("Middleware")
	Database = exports["mythic-base"]:FetchComponent("Database")
	Logger = exports["mythic-base"]:FetchComponent("Logger")
	Ped = exports["mythic-base"]:FetchComponent("Ped")
	Wardrobe = exports["mythic-base"]:FetchComponent("Wardrobe")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("Wardrobe", {
		"Chat",
		"Fetch",
		"Callbacks",
		"Middleware",
		"Database",
		"Locations",
		"Logger",
		"Ped",
		"Wardrobe",
	}, function(error)
		if #error > 0 then
			return
		end -- Do something to handle if not all dependencies loaded
		RetrieveWardrobeComponents()
		RegisterWardrobeCallbacks()
		RegisterWardrobeMiddleware()
		RegisterChatCommands()
	end)
end)

WARDROBE = {}
AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["mythic-base"]:RegisterComponent("Wardrobe", WARDROBE)
end)

function RegisterChatCommands()
	Chat:RegisterAdminCommand("wardrobe", function(source, args, rawCommand)
		TriggerClientEvent("Wardrobe:Client:ShowBitch", source)
	end, {
		help = "Test Notification",
	})

	Chat:RegisterCommand("clearprops", function(source, args, rawCommand)
		TriggerClientEvent("Ped:Client:Clearprops", source)
	end, {
		help = "Removes all the props attached to the entity",
	})

	Chat:RegisterAdminCommand("pedmenu", function(source, args, rawCommand)
		local targetSID
		local target = args[1]

		if target == "me" then
			targetSID = Fetch:Source(source):GetData("Character"):GetData("SID")
		else
			targetSID = tonumber(args[1])
		end
		local player = Fetch:SID(targetSID)

		if not player then return end

		TriggerClientEvent("Ped:Client:OpenClothing", player:GetData("Source"))
	end, {
		help = "(Gov) open pedmenu",
		params = {
			{
				name = "Target",
				help = "State ID",
			},
		},
	}, 1)
end

function RegisterWardrobeMiddleware()
	Middleware:Add("Characters:Creating", function(source, cData)
		return { {
			Wardrobe = {},
		} }
	end)
end

function RegisterWardrobeCallbacks()
	Callbacks:RegisterServerCallback("Wardrobe:GetAll", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		local wardrobe = char:GetData("Wardrobe") or {}

		local wr = {}

		for _, v in ipairs(wardrobe) do
			table.insert(wr, {
				label = v.label,
			})
		end

		cb(wr)
	end)

	Callbacks:RegisterServerCallback("Wardrobe:Save", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")

		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}

			local outfit = {
				label = data.name,
				data = ped.customization,
			}
			table.insert(wardrobe, outfit)
			char:SetData("Wardrobe", wardrobe)
			cb(true)
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:SaveExisting", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")

		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}

			if wardrobe[data] ~= nil then
				wardrobe[data].data = ped.customization
				char:SetData("Wardrobe", wardrobe)
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:Rename", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}
			if wardrobe[data.index] ~= nil then
				wardrobe[data.index].label = data.name
				char:SetData("Wardrobe", wardrobe)
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:MoveUp", function(source, _data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		local data = _data
		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}
			if wardrobe[data.index] ~= nil then
				-- Move up
				char:SetData("Wardrobe", moveItem(wardrobe, data.index, true))
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:MoveDown", function(source, _data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		local data = _data
		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}
			if wardrobe[data.index] ~= nil then
				-- Move Down
				char:SetData("Wardrobe", moveItem(wardrobe, data.index, false))
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:Equip", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		if char ~= nil then
			local outfit = char:GetData("Wardrobe")[tonumber(data)]
			if outfit ~= nil then
				Ped:ApplyOutfit(source, outfit)
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:Share", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		if char ~= nil then
			local outfit = char:GetData("Wardrobe")[tonumber(data)]
			if outfit ~= nil then
				local myPed = GetPlayerPed(source)
				local myCoords = GetEntityCoords(myPed)
				local myBucket = GetPlayerRoutingBucket(source)
				for k, v in pairs(Fetch:All()) do
					local tSource = v:GetData("Source")
					local tPed = GetPlayerPed(tSource)
					local coords = GetEntityCoords(tPed)
					if tSource ~= source and #(myCoords - coords) <= 5.0 and GetPlayerRoutingBucket(tSource) == myBucket then
						Callbacks:ClientCallback(tSource, "Wardrobe:Sharing:Begin", {
							label = outfit?.label,
							components = outfit?.data?.components,
							props = outfit?.data?.props
						}, function(acceptedOutfit)
							if acceptedOutfit then
								local tChar = v:GetData("Character")
								if tChar ~= nil then
									local ped = tChar:GetData("Ped")
									local wardrobe = tChar:GetData("Wardrobe") or {}

									local newOutfit = {
										label = outfit?.label,
										data = ped.customization,
									}

									if outfit.data.components then
										local originalHair = newOutfit.data.components.hair
										newOutfit.data.components = outfit.data.components
										newOutfit.data.components.hair = originalHair -- This is used so our characters hair isn't overidden by the outfit hair
									end

									if outfit?.data?.props then
										newOutfit.data.props = outfit.data.props
									end

									table.insert(wardrobe, newOutfit)
									tChar:SetData("Wardrobe", wardrobe)
								end
							end
						end)

						cb(true)
					end
				end
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:Delete", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		if char ~= nil then
			local wardrobe = char:GetData("Wardrobe") or {}
			table.remove(wardrobe, data)
			char:SetData("Wardrobe", wardrobe)
			cb(true)
		else
			cb(false)
		end
	end)


	Callbacks:RegisterServerCallback("Wardrobe:getOutfitById", function(source, data, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")
		if char ~= nil then
			local outfit = char:GetData("Wardrobe")[tonumber(data)]

			cb(outfit)
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:ExportClothing", function(source, data, cb)
		local generatedCode = GenerateClothingCode()
		local result = MySQL.insert.await(
			"INSERT INTO outfit_codes (Code, Label, Data) VALUES(?, ?, ?)",
			{
				generatedCode,
				data.label,
				json.encode(data.data),
			}
		)
		if result then
			cb(generatedCode, nil)
		else
			cb(false, "You need to wait a little bit before creating clothing codes")
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:GetExportClothingByCode", function(source, code, cb)
		local result = MySQL.query.await('SELECT Data FROM outfit_codes WHERE Code = ?', {
			tostring(code),
		})

		if result[1] ~= nil then
			if result[1].Data ~= nil then
				cb(result[1].Data)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Wardrobe:SaveFromExportedOutfit", function(source, cData, cb)
		local player = exports["mythic-base"]:FetchComponent("Fetch"):Source(source)
		local char = player:GetData("Character")

		if char ~= nil then
			local ped = char:GetData("Ped")
			local wardrobe = char:GetData("Wardrobe") or {}
			local outfit = json.decode(cData.outfitdata)

			local newOutfit = {
				label = cData?.label,
				data = ped.customization,
			}

			if outfit?.components then
				local originalHair = newOutfit.data.components.hair
				newOutfit.data.components = outfit.components
				newOutfit.data.components.hair = originalHair -- This is used so our characters hair isn't overidden by the outfit hair
			end

			if outfit?.props then
				newOutfit.data.props = outfit.props
			end

			table.insert(wardrobe, newOutfit)
			char:SetData("Wardrobe", wardrobe)
			cb(true)
		else
			cb(false)
		end
	end)
end

function moveItem(tables, oldindex, up) -- Well this looks like ass lmfao
	local function swap(_tables, new)
		_tables[oldindex], _tables[new] = _tables[new], _tables[oldindex]
		return _tables
	end
	if up then
		if oldindex == 1 then
			return tables; -- Already at top, ignore.
		else
			return swap(tables, oldindex-1) -- Move up.
		end
	else
		if oldindex ~= #tables then
			return swap(tables, oldindex+1) -- Move down.
		else
			return tables; -- Already at bottom, ignore.
		end
	end
end

function GenerateClothingCode()
    local UniqueFound = false
    local SerialNumber = nil
	local firstStringPart = "outfits-"
    while not UniqueFound do
        SerialNumber = firstStringPart..math.random(11111111, 99999999)
        local query = '%' .. SerialNumber .. '%'
        local result = MySQL.prepare.await('SELECT COUNT(*) as count FROM outfit_codes WHERE Code LIKE ?', { query })
        if result == 0 then
            UniqueFound = true
        end
    end
    return SerialNumber
end