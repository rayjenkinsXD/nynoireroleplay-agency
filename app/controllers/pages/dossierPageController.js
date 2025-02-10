import ControllerDataEnum from "../ControllerDataEnum.js";
import Dossier from "../../models/Dossier.js";
import { format } from "date-fns";
import * as path from "path";

export default async function dossierPageController(request, response) {
    const dossierId = request.params["dossierId"];
    const templatePath = path.join(ControllerDataEnum.VIEWS_DIR_PATH, "dossier.hbs");

    try {
        const dossier = await Dossier.getDossier(dossierId);

        let fullname = dossier.getFullname();
        let passport = dossier.getPassport();

        if (passport == null) {
            passport = "Не указано";
        }
        
        let publishDate = format(dossier.getPublishDate(), "dd/MM/yyyy");
        let sex = dossier.isMale();

        if (sex === true) {
            sex = "Мужчина";
        }
        else if (sex === false) {
            sex = "Женщина";
        }
        else {
            sex = "Не указано";
        }

        let race = "Не указано";
        
        switch (dossier.getRace()) {
            case "european":
                race = "Европеец";
                break;
            case "negro":
                race = "Негр";
                break;
            case "asian":
                race = "Азиат";
                break;
        }

        let bio = dossier.getDescription();

        if (bio == null) {
            bio = "Биография отсутствует.";
        }

        let phoneNumbers = await dossier.getPhoneNumbers();

        let vehicles = await dossier.getVehicles();
        let vehiclesRenderData = [];

        for (let vehicle of vehicles) {
            vehiclesRenderData.push({
                model: vehicle.getModel(),
                number: vehicle.getNumber(),
                color: vehicle.getColor()
            });
        }

        let dossierNotes = await dossier.getAllNotes();
        let notesRenderData = [];

        for (let note of dossierNotes) {
            notesRenderData.push({
                editor: note.getEditor().getUsername(),
                date: format(note.getPublishDate(), "kk:mm dd/MM/yyyy"),
                text: note.getText()
            });
        }

        const renderData = {
            fullname,
            passport,
            publishDate,
            sex,
            race,
            bio,
            phoneNumbers,
            "vehicles": vehiclesRenderData,
            "notes": notesRenderData
        };

        response.render(templatePath, renderData);
        
    } catch (error) {
        console.log(error);
        response.sendStatus(400);
    }
}