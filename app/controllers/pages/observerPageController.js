import ControllerDataEnum from "../ControllerDataEnum.js";
import Dossier from "../../models/Dossier.js";
import { format } from "date-fns";
import * as path from "path";

export default async function observerPageController(request, response) {
    const templatePath = path.join(ControllerDataEnum.VIEWS_DIR_PATH, "observer.hbs");

    const dossiers = await Dossier.getAllDossiers();
    const renderData = {
        dossiers: []
    };

    for (let dossier of dossiers) {
        let fullname = dossier.getFullname();
        let passport = dossier.getPassport();

        if (passport == null) {
            passport = "Не указано";
        }
        
        let publishDate = format(dossier.getPublishDate(), "dd/MM/yyyy");

        let bio = dossier.getDescription();

        if (bio == null) {
            bio = "Биография отсутствует.";
        }

        let id = dossier.getId();

        renderData.dossiers.push({
            fullname,
            passport,
            publishDate,
            bio,
            id
        });
    }

    response.render(templatePath, renderData);
}