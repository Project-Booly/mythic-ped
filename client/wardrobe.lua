local _sharePromise = nil

AddEventHandler("Wardrobe:Shared:DependencyUpdate", RetrieveWardrobeComponents)
function RetrieveWardrobeComponents()
	Callbacks = exports["mythic-base"]:FetchComponent("Callbacks")
	Notification = exports["mythic-base"]:FetchComponent("Notification")
	Utils = exports["mythic-base"]:FetchComponent("Utils")
	ListMenu = exports["mythic-base"]:FetchComponent("ListMenu")
	Input = exports["mythic-base"]:FetchComponent("Input")
	Confirm = exports["mythic-base"]:FetchComponent("Confirm")
	Sounds = exports["mythic-base"]:FetchComponent("Sounds")
	Wardrobe = exports["mythic-base"]:FetchComponent("Wardrobe")
	Admin = exports["mythic-base"]:FetchComponent("Admin")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("ListMenu", {
		"Callbacks",
		"Notification",
		"Utils",
		"ListMenu",
		"Input",
		"Confirm",
		"Sounds",
		"Wardrobe",
		"Admin",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveWardrobeComponents()

		Callbacks:RegisterClientCallback("Wardrobe:Sharing:Begin", function(data, cb)
			if _sharePromise == nil then
				_sharePromise = promise.new()
				Confirm:Show(
					'Confirm Outfit Sharing',
					{
						no = 'Wardrobe:Sharing:Deny',
						yes = 'Wardrobe:Sharing:Confirm',
					},
					string.format(
						[[
							Please confirm that you would like to recieve the outfit below.<br>
							Outfit Name: %s<br>
						]],
						data.label
					),
					{},
					'Refuse',
					'Accept'
				)

				cb(Citizen.Await(_sharePromise))
			else
				cb(false)
			end
		end)

		AddEventHandler('Wardrobe:Sharing:Confirm', function(data)
			_sharePromise:resolve(true)
            _sharePromise = nil
		end)

		AddEventHandler('Wardrobe:Sharing:Deny', function(data)
			_sharePromise:resolve(false)
            _sharePromise = nil
		end)
	end)
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["mythic-base"]:RegisterComponent("Wardrobe", WARDROBE)
end)

AddEventHandler("Wardrobe:Client:SaveNew", function(data)
	Input:Show("Outfit Name", "Outfit Name", {
		{
			id = "name",
			type = "text",
			options = {
				inputProps = {
					maxLength = 24,
				},
			},
		},
	}, "Wardrobe:Client:DoSave", data)
end)

AddEventHandler("Wardrobe:Client:Rename", function(data)
	Input:Show("Outfit Name", "Outfit Name", {
		{
			id = "name",
			type = "text",
			options = {
				inputProps = {
					maxLength = 24,
				},
			},
		},
	}, "Wardrobe:Client:DoRename", data.index)
end)

AddEventHandler("Wardrobe:Client:SaveExisting", function(data)
	Callbacks:ServerCallback("Wardrobe:SaveExisting", data.index, function(state)
		if state then
			Notification:Success("Outfit Saved")
			Wardrobe:Show()
		else
			Notification:Error("Unable to Save Outfit")
		end
	end)
end)

AddEventHandler("Wardrobe:Client:DoSave", function(values, data) 
	Callbacks:ServerCallback("Wardrobe:Save", {
		index = data,
		name = values.name,
	}, function(state)
		if state then
			Notification:Success("Outfit Saved")
			Wardrobe:Show()
		else
			Notification:Error("Unable to Save Outfit")
		end
	end)
end)

AddEventHandler("Wardrobe:Client:Replace", function(data)
	Confirm:Show(string.format("Are you sure you want to replace %s?", data.label), {
		yes = "Wardrobe:Client:SaveExisting",
		no = "Wardrobe:Client:Delete:No",
	}, "", data, 'Wait No', 'Replace it')
end)

AddEventHandler("Wardrobe:Client:Delete", function(data)
	Confirm:Show(string.format("Delete %s?", data.label), {
		yes = "Wardrobe:Client:Delete:Yes",
		no = "Wardrobe:Client:Delete:No",
	}, "", data.index)
end)

AddEventHandler("Wardrobe:Client:Delete:Yes", function(data)
	Callbacks:ServerCallback("Wardrobe:Delete", data, function(s)
		if s then
			Notification:Success("Outfit Deleted")
			Wardrobe:Show()
		end
	end)
end)

AddEventHandler("Wardrobe:Client:Equip", function(data)
	Callbacks:ServerCallback("Wardrobe:Equip", data.index, function(state)
		if state then
			Sounds.Play:One("outfit_change.ogg", 0.3)
			Notification:Success("Outfit Equipped")
		else
			Notification:Error("Unable to Equip Outfit")
		end
	end)
end)

AddEventHandler("Wardrobe:Client:startImportOutfit", function(data)
	Callbacks:ServerCallback("Wardrobe:getOutfitById", data.index, function(outfit)

		if not outfit then
			Notification:Error('Outfit cannot be shared.')
			return
		end

		Callbacks:ServerCallback('Wardrobe:ExportClothing', outfit, function(exported, errorMsg)
			if not exported then
				Notification:Error(errorMsg or 'Something bad happened, please try again.')
				return
			end

			Notification:Success('Exported clothing outfit, the code was copied to the clipboard.')

			Admin:CopyClipboard(tostring(exported))
		end)
	end)
end)

AddEventHandler("Wardrobe:Client:ApplyImportedOutfit", function(Label, Code)
	Callbacks:ServerCallback("Wardrobe:GetExportClothingByCode", Code, function(outfit)

		if not outfit then
			Notification:Error('Code does not exist')
			return
		end

		local data = {
			label = Label,
			outfitdata = outfit,
		}

		Callbacks:ServerCallback("Wardrobe:SaveFromExportedOutfit", data, function(done)
			if not done then
				Notification:Error('Fail to add outfit to wardrobe , try again.')
				return
			end
		end)

		Notification:Success('Outfit Added to wardrobe.')
	end)
end)

AddEventHandler("Wardrobe:Client:DoRename", function(values, data) 
	Callbacks:ServerCallback("Wardrobe:Rename", {
		index = data,
		name = values.name,
	}, function(state)
		if state then
			Notification:Success("Outfit Renamed")
			Wardrobe:Show()
		else
			Notification:Error("Unable to Rename Outfit")
		end
	end)
end)

AddEventHandler("Wardrobe:Client:ShareOpts", function(data)
	Confirm:Show(string.format("Share %s?", data.label), {
		yes = "Wardrobe:Client:Share",
		no = "Wardrobe:Client:startExportingOutfit",
	}, "Share to Nearby civs or Get an import code to send to cunts", data, 'Get Code', 'Share Nearby')
end)

AddEventHandler("Wardrobe:Client:Share", function(data)
	Callbacks:ServerCallback("Wardrobe:Share", data.index, function(state)
		if not state then
			Notification:Error("Unable to Share Outfit")
		end
	end)
end)

RegisterNetEvent("Wardrobe:Client:MoveUp", function(data)
	Callbacks:ServerCallback("Wardrobe:MoveUp", data, function(state)
		if state then
			Wardrobe:Show()
		else
			Notification:Error("Unable to Change Order")
		end
	end)
end)

RegisterNetEvent("Wardrobe:Client:MoveDown", function(data)
	Callbacks:ServerCallback("Wardrobe:MoveDown", data, function(state)
		if state then
			Wardrobe:Show()
		else
			Notification:Error("Unable to Change Order")
		end
	end)
end)

RegisterNetEvent("Wardrobe:Client:ShowBitch", function(eventRoutine)
	Wardrobe:Show()
end)

WARDROBE = {
	Show = function(self)
		Callbacks:ServerCallback("Wardrobe:GetAll", {}, function(data)
			local items = {}
			for k, v in pairs(data) do
				if v.label ~= nil then
					local actions = {
						{
							icon = "floppy-disk",
							event = "Wardrobe:Client:Replace",
						},
						{
							icon = "shirt",
							event = "Wardrobe:Client:Equip",
						},
						{
							icon = "share",
							event = "Wardrobe:Client:ShareOpts",
						},
						{
							icon = "signature",
							event = "Wardrobe:Client:Rename",
						},
						{
							icon = "x",
							event = "Wardrobe:Client:Delete",
						}
					}

					if (k == #data) then
						table.insert(actions, 1, {icon = "arrow-up", event = "Wardrobe:Client:MoveUp"})
					elseif (k == 1) then
						table.insert(actions, 1, {icon = "arrow-down", event = "Wardrobe:Client:MoveDown"})
					else
						table.insert(actions,1, {icon = "arrow-up", event = "Wardrobe:Client:MoveUp"})
						table.insert(actions,2, {icon = "arrow-down", event = "Wardrobe:Client:MoveDown"})
					end

					table.insert(items, {
						label = v.label,
						description = string.format("Outfit #%s", k),
						actions = actions,
						data = {
							index = k,
							label = v.label,
						},
					})
				end
			end

			table.insert(items, {
				label = "Save New Outfit",
				event = "Wardrobe:Client:SaveNew",
			})

			ListMenu:Show({
				main = {
					label = "Wardrobe",
					items = items,
				},
			})
		end)
	end,
	Close = function(self)
		SetNuiFocus(false, false)
		SendNUIMessage({
			type = "CLOSE_LIST_MENU",
		})
	end,
}