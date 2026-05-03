import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TtsService } from '../../../core/services/tts-services/tts-service';
import { Tts } from '../../../core/interfaces/tts';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tts-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tts-modal.html',
  styleUrl: './tts-modal.scss',
})
export class TtsModal implements OnDestroy {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  allVoices = [
    // --- Español (Múltiples Regiones) ---
    { name: 'Elena', locale: 'es-AR', value: 'es-AR-Elena' },
    { name: 'Tomas', locale: 'es-AR', value: 'es-AR-Tomas' },
    { name: 'Marcelo', locale: 'es-BO', value: 'es-BO-Marcelo' },
    { name: 'Sofia', locale: 'es-BO', value: 'es-BO-Sofia' },
    { name: 'Catalina', locale: 'es-CL', value: 'es-CL-Catalina' },
    { name: 'Lorenzo', locale: 'es-CL', value: 'es-CL-Lorenzo' },
    { name: 'Gonzalo', locale: 'es-CO', value: 'es-CO-Gonzalo' },
    { name: 'Salome', locale: 'es-CO', value: 'es-CO-Salome' },
    { name: 'Juan', locale: 'es-CR', value: 'es-CR-Juan' },
    { name: 'Maria', locale: 'es-CR', value: 'es-CR-Maria' },
    { name: 'Belkys', locale: 'es-CU', value: 'es-CU-Belkys' },
    { name: 'Manuel', locale: 'es-CU', value: 'es-CU-Manuel' },
    { name: 'Emilio', locale: 'es-DO', value: 'es-DO-Emilio' },
    { name: 'Ramona', locale: 'es-DO', value: 'es-DO-Ramona' },
    { name: 'Andrea', locale: 'es-EC', value: 'es-EC-Andrea' },
    { name: 'Luis', locale: 'es-EC', value: 'es-EC-Luis' },
    { name: 'Alvaro', locale: 'es-ES', value: 'es-ES-Alvaro' },
    { name: 'Elvira', locale: 'es-ES', value: 'es-ES-Elvira' },
    { name: 'Ximena', locale: 'es-ES', value: 'es-ES-Ximena' },
    { name: 'Javier', locale: 'es-GQ', value: 'es-GQ-Javier' },
    { name: 'Teresa', locale: 'es-GQ', value: 'es-GQ-Teresa' },
    { name: 'Andres', locale: 'es-GT', value: 'es-GT-Andres' },
    { name: 'Marta', locale: 'es-GT', value: 'es-GT-Marta' },
    { name: 'Carlos', locale: 'es-HN', value: 'es-HN-Carlos' },
    { name: 'Karla', locale: 'es-HN', value: 'es-HN-Karla' },
    { name: 'Dalia', locale: 'es-MX', value: 'es-MX-Dalia' },
    { name: 'Jorge', locale: 'es-MX', value: 'es-MX-Jorge' },
    { name: 'Federico', locale: 'es-NI', value: 'es-NI-Federico' },
    { name: 'Yolanda', locale: 'es-NI', value: 'es-NI-Yolanda' },
    { name: 'Margarita', locale: 'es-PA', value: 'es-PA-Margarita' },
    { name: 'Roberto', locale: 'es-PA', value: 'es-PA-Roberto' },
    { name: 'Alex', locale: 'es-PE', value: 'es-PE-Alex' },
    { name: 'Camila', locale: 'es-PE', value: 'es-PE-Camila' },
    { name: 'Karina', locale: 'es-PR', value: 'es-PR-Karina' },
    { name: 'Victor', locale: 'es-PR', value: 'es-PR-Victor' },
    { name: 'Mario', locale: 'es-PY', value: 'es-PY-Mario' },
    { name: 'Tania', locale: 'es-PY', value: 'es-PY-Tania' },
    { name: 'Lorena', locale: 'es-SV', value: 'es-SV-Lorena' },
    { name: 'Rodrigo', locale: 'es-SV', value: 'es-SV-Rodrigo' },
    { name: 'Alonso', locale: 'es-US', value: 'es-US-Alonso' },
    { name: 'Paloma', locale: 'es-US', value: 'es-US-Paloma' },
    { name: 'Mateo', locale: 'es-UY', value: 'es-UY-Mateo' },
    { name: 'Valentina', locale: 'es-UY', value: 'es-UY-Valentina' },
    { name: 'Paola', locale: 'es-VE', value: 'es-VE-Paola' },
    { name: 'Sebastian', locale: 'es-VE', value: 'es-VE-Sebastian' },

    // --- Inglés (Múltiples Regiones) ---
    { name: 'Ana', locale: 'en-US', value: 'en-US-Ana' },
    { name: 'Andrew', locale: 'en-US', value: 'en-US-Andrew' },
    {
      name: 'AndrewMultilingual',
      locale: 'en-US',
      value: 'en-US-AndrewMultilingual',
    },
    { name: 'Aria', locale: 'en-US', value: 'en-US-Aria' },
    { name: 'Ava', locale: 'en-US', value: 'en-US-Ava' },
    {
      name: 'AvaMultilingual',
      locale: 'en-US',
      value: 'en-US-AvaMultilingual',
    },
    { name: 'Brian', locale: 'en-US', value: 'en-US-Brian' },
    {
      name: 'BrianMultilingual',
      locale: 'en-US',
      value: 'en-US-BrianMultilingual',
    },
    { name: 'Christopher', locale: 'en-US', value: 'en-US-Christopher' },
    { name: 'Emma', locale: 'en-US', value: 'en-US-Emma' },
    {
      name: 'EmmaMultilingual',
      locale: 'en-US',
      value: 'en-US-EmmaMultilingual',
    },
    { name: 'Eric', locale: 'en-US', value: 'en-US-Eric' },
    { name: 'Guy', locale: 'en-US', value: 'en-US-Guy' },
    { name: 'Jenny', locale: 'en-US', value: 'en-US-Jenny' },
    { name: 'Michelle', locale: 'en-US', value: 'en-US-Michelle' },
    { name: 'Roger', locale: 'en-US', value: 'en-US-Roger' },
    { name: 'Steffan', locale: 'en-US', value: 'en-US-Steffan' },
    { name: 'Natasha', locale: 'en-AU', value: 'en-AU-Natasha' },
    { name: 'William', locale: 'en-AU', value: 'en-AU-William' },
    { name: 'Clara', locale: 'en-CA', value: 'en-CA-Clara' },
    { name: 'Liam', locale: 'en-CA', value: 'en-CA-Liam' },
    { name: 'Libby', locale: 'en-GB', value: 'en-GB-Libby' },
    { name: 'Maisie', locale: 'en-GB', value: 'en-GB-Maisie' },
    { name: 'Ryan', locale: 'en-GB', value: 'en-GB-Ryan' },
    { name: 'Sonia', locale: 'en-GB', value: 'en-GB-Sonia' },
    { name: 'Thomas', locale: 'en-GB', value: 'en-GB-Thomas' },
    { name: 'Sam', locale: 'en-HK', value: 'en-HK-Sam' },
    { name: 'Yan', locale: 'en-HK', value: 'en-HK-Yan' },
    { name: 'Connor', locale: 'en-IE', value: 'en-IE-Connor' },
    { name: 'Emily', locale: 'en-IE', value: 'en-IE-Emily' },
    { name: 'Neerja', locale: 'en-IN', value: 'en-IN-Neerja' },
    {
      name: 'NeerjaExpressive',
      locale: 'en-IN',
      value: 'en-IN-NeerjaExpressive',
    },
    { name: 'Prabhat', locale: 'en-IN', value: 'en-IN-Prabhat' },
    { name: 'Asilia', locale: 'en-KE', value: 'en-KE-Asilia' },
    { name: 'Chilemba', locale: 'en-KE', value: 'en-KE-Chilemba' },
    { name: 'Abeo', locale: 'en-NG', value: 'en-NG-Abeo' },
    { name: 'Ezinne', locale: 'en-NG', value: 'en-NG-Ezinne' },
    { name: 'Mitchell', locale: 'en-NZ', value: 'en-NZ-Mitchell' },
    { name: 'Molly', locale: 'en-NZ', value: 'en-NZ-Molly' },
    { name: 'James', locale: 'en-PH', value: 'en-PH-James' },
    { name: 'Rosa', locale: 'en-PH', value: 'en-PH-Rosa' },
    { name: 'Luna', locale: 'en-SG', value: 'en-SG-Luna' },
    { name: 'Wayne', locale: 'en-SG', value: 'en-SG-Wayne' },
    { name: 'Elimu', locale: 'en-TZ', value: 'en-TZ-Elimu' },
    { name: 'Imani', locale: 'en-TZ', value: 'en-TZ-Imani' },
    { name: 'Leah', locale: 'en-ZA', value: 'en-ZA-Leah' },
    { name: 'Luke', locale: 'en-ZA', value: 'en-ZA-Luke' },

    // --- Portugués ---
    { name: 'Antonio', locale: 'pt-BR', value: 'pt-BR-Antonio' },
    { name: 'Francisca', locale: 'pt-BR', value: 'pt-BR-Francisca' },
    { name: 'Thalita', locale: 'pt-BR', value: 'pt-BR-Thalita' },
    { name: 'Duarte', locale: 'pt-PT', value: 'pt-PT-Duarte' },
    { name: 'Raquel', locale: 'pt-PT', value: 'pt-PT-Raquel' },

    // --- Francés ---
    { name: 'Charline', locale: 'fr-BE', value: 'fr-BE-Charline' },
    { name: 'Gerard', locale: 'fr-BE', value: 'fr-BE-Gerard' },
    { name: 'Antoine', locale: 'fr-CA', value: 'fr-CA-Antoine' },
    { name: 'Jean', locale: 'fr-CA', value: 'fr-CA-Jean' },
    { name: 'Sylvie', locale: 'fr-CA', value: 'fr-CA-Sylvie' },
    { name: 'Thierry', locale: 'fr-CA', value: 'fr-CA-Thierry' },
    { name: 'Ariane', locale: 'fr-CH', value: 'fr-CH-Ariane' },
    { name: 'Fabrice', locale: 'fr-CH', value: 'fr-CH-Fabrice' },
    { name: 'Denise', locale: 'fr-FR', value: 'fr-FR-Denise' },
    { name: 'Eloise', locale: 'fr-FR', value: 'fr-FR-Eloise' },
    { name: 'Henri', locale: 'fr-FR', value: 'fr-FR-Henri' },
    {
      name: 'RemyMultilingual',
      locale: 'fr-FR',
      value: 'fr-FR-RemyMultilingual',
    },
    {
      name: 'VivienneMultilingual',
      locale: 'fr-FR',
      value: 'fr-FR-VivienneMultilingual',
    },

    // --- Chino ---
    { name: 'Xiaoxiao', locale: 'zh-CN', value: 'zh-CN-Xiaoxiao' },
    { name: 'Xiaoyi', locale: 'zh-CN', value: 'zh-CN-Xiaoyi' },
    { name: 'Yunjian', locale: 'zh-CN', value: 'zh-CN-Yunjian' },
    { name: 'Yunxi', locale: 'zh-CN', value: 'zh-CN-Yunxi' },
    { name: 'Yunxia', locale: 'zh-CN', value: 'zh-CN-Yunxia' },
    { name: 'Yunyang', locale: 'zh-CN', value: 'zh-CN-Yunyang' },
    {
      name: 'Xiaobei',
      locale: 'zh-CN-liaoning',
      value: 'zh-CN-liaoning-Xiaobei',
    },
    { name: 'Xiaoni', locale: 'zh-CN-shaanxi', value: 'zh-CN-shaanxi-Xiaoni' },
    { name: 'HiuGaai', locale: 'zh-HK', value: 'zh-HK-HiuGaai' },
    { name: 'HiuMaan', locale: 'zh-HK', value: 'zh-HK-HiuMaan' },
    { name: 'WanLung', locale: 'zh-HK', value: 'zh-HK-WanLung' },
    { name: 'HsiaoChen', locale: 'zh-TW', value: 'zh-TW-HsiaoChen' },
    { name: 'HsiaoYu', locale: 'zh-TW', value: 'zh-TW-HsiaoYu' },
    { name: 'YunJhe', locale: 'zh-TW', value: 'zh-TW-YunJhe' },

    // --- Árabe ---
    { name: 'Fatima', locale: 'ar-AE', value: 'ar-AE-Fatima' },
    { name: 'Hamdan', locale: 'ar-AE', value: 'ar-AE-Hamdan' },
    { name: 'Ali', locale: 'ar-BH', value: 'ar-BH-Ali' },
    { name: 'Laila', locale: 'ar-BH', value: 'ar-BH-Laila' },
    { name: 'Amina', locale: 'ar-DZ', value: 'ar-DZ-Amina' },
    { name: 'Ismael', locale: 'ar-DZ', value: 'ar-DZ-Ismael' },
    { name: 'Salma', locale: 'ar-EG', value: 'ar-EG-Salma' },
    { name: 'Shakir', locale: 'ar-EG', value: 'ar-EG-Shakir' },
    { name: 'Bassel', locale: 'ar-IQ', value: 'ar-IQ-Bassel' },
    { name: 'Rana', locale: 'ar-IQ', value: 'ar-IQ-Rana' },
    { name: 'Sana', locale: 'ar-JO', value: 'ar-JO-Sana' },
    { name: 'Taim', locale: 'ar-JO', value: 'ar-JO-Taim' },
    { name: 'Fahed', locale: 'ar-KW', value: 'ar-KW-Fahed' },
    { name: 'Noura', locale: 'ar-KW', value: 'ar-KW-Noura' },
    { name: 'Layla', locale: 'ar-LB', value: 'ar-LB-Layla' },
    { name: 'Rami', locale: 'ar-LB', value: 'ar-LB-Rami' },
    { name: 'Iman', locale: 'ar-LY', value: 'ar-LY-Iman' },
    { name: 'Omar', locale: 'ar-LY', value: 'ar-LY-Omar' },
    { name: 'Jamal', locale: 'ar-MA', value: 'ar-MA-Jamal' },
    { name: 'Mouna', locale: 'ar-MA', value: 'ar-MA-Mouna' },
    { name: 'Abdullah', locale: 'ar-OM', value: 'ar-OM-Abdullah' },
    { name: 'Aysha', locale: 'ar-OM', value: 'ar-OM-Aysha' },
    { name: 'Amal', locale: 'ar-QA', value: 'ar-QA-Amal' },
    { name: 'Moaz', locale: 'ar-QA', value: 'ar-QA-Moaz' },
    { name: 'Hamed', locale: 'ar-SA', value: 'ar-SA-Hamed' },
    { name: 'Zariyah', locale: 'ar-SA', value: 'ar-SA-Zariyah' },
    { name: 'Amany', locale: 'ar-SY', value: 'ar-SY-Amany' },
    { name: 'Laith', locale: 'ar-SY', value: 'ar-SY-Laith' },
    { name: 'Hedi', locale: 'ar-TN', value: 'ar-TN-Hedi' },
    { name: 'Reem', locale: 'ar-TN', value: 'ar-TN-Reem' },
    { name: 'Maryam', locale: 'ar-YE', value: 'ar-YE-Maryam' },
    { name: 'Saleh', locale: 'ar-YE', value: 'ar-YE-Saleh' },

    // --- Alemán ---
    { name: 'Ingrid', locale: 'de-AT', value: 'de-AT-Ingrid' },
    { name: 'Jonas', locale: 'de-AT', value: 'de-AT-Jonas' },
    { name: 'Jan', locale: 'de-CH', value: 'de-CH-Jan' },
    { name: 'Leni', locale: 'de-CH', value: 'de-CH-Leni' },
    { name: 'Amala', locale: 'de-DE', value: 'de-DE-Amala' },
    { name: 'Conrad', locale: 'de-DE', value: 'de-DE-Conrad' },
    {
      name: 'FlorianMultilingual',
      locale: 'de-DE',
      value: 'de-DE-FlorianMultilingual',
    },
    { name: 'Katja', locale: 'de-DE', value: 'de-DE-Katja' },
    { name: 'Killian', locale: 'de-DE', value: 'de-DE-Killian' },
    {
      name: 'SeraphinaMultilingual',
      locale: 'de-DE',
      value: 'de-DE-SeraphinaMultilingual',
    },

    // --- Italiano ---
    { name: 'Diego', locale: 'it-IT', value: 'it-IT-Diego' },
    { name: 'Elsa', locale: 'it-IT', value: 'it-IT-Elsa' },
    { name: 'Giuseppe', locale: 'it-IT', value: 'it-IT-Giuseppe' },
    { name: 'Isabella', locale: 'it-IT', value: 'it-IT-Isabella' },

    // --- Otros Idiomas del Mundo (A-Z) ---
    { name: 'Adri', locale: 'af-ZA', value: 'af-ZA-Adri' },
    { name: 'Willem', locale: 'af-ZA', value: 'af-ZA-Willem' },
    { name: 'Ameha', locale: 'am-ET', value: 'am-ET-Ameha' },
    { name: 'Mekdes', locale: 'am-ET', value: 'am-ET-Mekdes' },
    { name: 'Babek', locale: 'az-AZ', value: 'az-AZ-Babek' },
    { name: 'Banu', locale: 'az-AZ', value: 'az-AZ-Banu' },
    { name: 'Borislav', locale: 'bg-BG', value: 'bg-BG-Borislav' },
    { name: 'Kalina', locale: 'bg-BG', value: 'bg-BG-Kalina' },
    { name: 'Nabanita', locale: 'bn-BD', value: 'bn-BD-Nabanita' },
    { name: 'Pradeep', locale: 'bn-BD', value: 'bn-BD-Pradeep' },
    { name: 'Bashkar', locale: 'bn-IN', value: 'bn-IN-Bashkar' },
    { name: 'Tanishaa', locale: 'bn-IN', value: 'bn-IN-Tanishaa' },
    { name: 'Goran', locale: 'bs-BA', value: 'bs-BA-Goran' },
    { name: 'Vesna', locale: 'bs-BA', value: 'bs-BA-Vesna' },
    { name: 'Enric', locale: 'ca-ES', value: 'ca-ES-Enric' },
    { name: 'Joana', locale: 'ca-ES', value: 'ca-ES-Joana' },
    { name: 'Antonin', locale: 'cs-CZ', value: 'cs-CZ-Antonin' },
    { name: 'Vlasta', locale: 'cs-CZ', value: 'cs-CZ-Vlasta' },
    { name: 'Aled', locale: 'cy-GB', value: 'cy-GB-Aled' },
    { name: 'Nia', locale: 'cy-GB', value: 'cy-GB-Nia' },
    { name: 'Christel', locale: 'da-DK', value: 'da-DK-Christel' },
    { name: 'Jeppe', locale: 'da-DK', value: 'da-DK-Jeppe' },
    { name: 'Athina', locale: 'el-GR', value: 'el-GR-Athina' },
    { name: 'Nestoras', locale: 'el-GR', value: 'el-GR-Nestoras' },
    { name: 'Anu', locale: 'et-EE', value: 'et-EE-Anu' },
    { name: 'Kert', locale: 'et-EE', value: 'et-EE-Kert' },
    { name: 'Dilara', locale: 'fa-IR', value: 'fa-IR-Dilara' },
    { name: 'Farid', locale: 'fa-IR', value: 'fa-IR-Farid' },
    { name: 'Harri', locale: 'fi-FI', value: 'fi-FI-Harri' },
    { name: 'Noora', locale: 'fi-FI', value: 'fi-FI-Noora' },
    { name: 'Angelo', locale: 'fil-PH', value: 'fil-PH-Angelo' },
    { name: 'Blessica', locale: 'fil-PH', value: 'fil-PH-Blessica' },
    { name: 'Colm', locale: 'ga-IE', value: 'ga-IE-Colm' },
    { name: 'Orla', locale: 'ga-IE', value: 'ga-IE-Orla' },
    { name: 'Roi', locale: 'gl-ES', value: 'gl-ES-Roi' },
    { name: 'Sabela', locale: 'gl-ES', value: 'gl-ES-Sabela' },
    { name: 'Dhwani', locale: 'gu-IN', value: 'gu-IN-Dhwani' },
    { name: 'Niranjan', locale: 'gu-IN', value: 'gu-IN-Niranjan' },
    { name: 'Avri', locale: 'he-IL', value: 'he-IL-Avri' },
    { name: 'Hila', locale: 'he-IL', value: 'he-IL-Hila' },
    { name: 'Madhur', locale: 'hi-IN', value: 'hi-IN-Madhur' },
    { name: 'Swara', locale: 'hi-IN', value: 'hi-IN-Swara' },
    { name: 'Gabrijela', locale: 'hr-HR', value: 'hr-HR-Gabrijela' },
    { name: 'Srecko', locale: 'hr-HR', value: 'hr-HR-Srecko' },
    { name: 'Noemi', locale: 'hu-HU', value: 'hu-HU-Noemi' },
    { name: 'Tamas', locale: 'hu-HU', value: 'hu-HU-Tamas' },
    { name: 'Ardi', locale: 'id-ID', value: 'id-ID-Ardi' },
    { name: 'Gadis', locale: 'id-ID', value: 'id-ID-Gadis' },
    { name: 'Gudrun', locale: 'is-IS', value: 'is-IS-Gudrun' },
    { name: 'Gunnar', locale: 'is-IS', value: 'is-IS-Gunnar' },
    { name: 'Keita', locale: 'ja-JP', value: 'ja-JP-Keita' },
    { name: 'Nanami', locale: 'ja-JP', value: 'ja-JP-Nanami' },
    { name: 'Dimas', locale: 'jv-ID', value: 'jv-ID-Dimas' },
    { name: 'Siti', locale: 'jv-ID', value: 'jv-ID-Siti' },
    { name: 'Eka', locale: 'ka-GE', value: 'ka-GE-Eka' },
    { name: 'Giorgi', locale: 'ka-GE', value: 'ka-GE-Giorgi' },
    { name: 'Aigul', locale: 'kk-KZ', value: 'kk-KZ-Aigul' },
    { name: 'Daulet', locale: 'kk-KZ', value: 'kk-KZ-Daulet' },
    { name: 'Piseth', locale: 'km-KH', value: 'km-KH-Piseth' },
    { name: 'Sreymom', locale: 'km-KH', value: 'km-KH-Sreymom' },
    { name: 'Gagan', locale: 'kn-IN', value: 'kn-IN-Gagan' },
    { name: 'Sapna', locale: 'kn-IN', value: 'kn-IN-Sapna' },
    { name: 'Hyunsu', locale: 'ko-KR', value: 'ko-KR-Hyunsu' },
    { name: 'InJoon', locale: 'ko-KR', value: 'ko-KR-InJoon' },
    { name: 'SunHi', locale: 'ko-KR', value: 'ko-KR-SunHi' },
    { name: 'Chanthavong', locale: 'lo-LA', value: 'lo-LA-Chanthavong' },
    { name: 'Keomany', locale: 'lo-LA', value: 'lo-LA-Keomany' },
    { name: 'Leonas', locale: 'lt-LT', value: 'lt-LT-Leonas' },
    { name: 'Ona', locale: 'lt-LT', value: 'lt-LT-Ona' },
    { name: 'Everita', locale: 'lv-LV', value: 'lv-LV-Everita' },
    { name: 'Nils', locale: 'lv-LV', value: 'lv-LV-Nils' },
    { name: 'Aleksandar', locale: 'mk-MK', value: 'mk-MK-Aleksandar' },
    { name: 'Marija', locale: 'mk-MK', value: 'mk-MK-Marija' },
    { name: 'Midhun', locale: 'ml-IN', value: 'ml-IN-Midhun' },
    { name: 'Sobhana', locale: 'ml-IN', value: 'ml-IN-Sobhana' },
    { name: 'Bataa', locale: 'mn-MN', value: 'mn-MN-Bataa' },
    { name: 'Yesui', locale: 'mn-MN', value: 'mn-MN-Yesui' },
    { name: 'Aarohi', locale: 'mr-IN', value: 'mr-IN-Aarohi' },
    { name: 'Manohar', locale: 'mr-IN', value: 'mr-IN-Manohar' },
    { name: 'Osman', locale: 'ms-MY', value: 'ms-MY-Osman' },
    { name: 'Yasmin', locale: 'ms-MY', value: 'ms-MY-Yasmin' },
    { name: 'Grace', locale: 'mt-MT', value: 'mt-MT-Grace' },
    { name: 'Joseph', locale: 'mt-MT', value: 'mt-MT-Joseph' },
    { name: 'Nilar', locale: 'my-MM', value: 'my-MM-Nilar' },
    { name: 'Thiha', locale: 'my-MM', value: 'my-MM-Thiha' },
    { name: 'Finn', locale: 'nb-NO', value: 'nb-NO-Finn' },
    { name: 'Pernille', locale: 'nb-NO', value: 'nb-NO-Pernille' },
    { name: 'Hemkala', locale: 'ne-NP', value: 'ne-NP-Hemkala' },
    { name: 'Sagar', locale: 'ne-NP', value: 'ne-NP-Sagar' },
    { name: 'Arnaud', locale: 'nl-BE', value: 'nl-BE-Arnaud' },
    { name: 'Dena', locale: 'nl-BE', value: 'nl-BE-Dena' },
    { name: 'Colette', locale: 'nl-NL', value: 'nl-NL-Colette' },
    { name: 'Fenna', locale: 'nl-NL', value: 'nl-NL-Fenna' },
    { name: 'Maarten', locale: 'nl-NL', value: 'nl-NL-Maarten' },
    { name: 'Marek', locale: 'pl-PL', value: 'pl-PL-Marek' },
    { name: 'Zofia', locale: 'pl-PL', value: 'pl-PL-Zofia' },
    { name: 'GulNawaz', locale: 'ps-AF', value: 'ps-AF-GulNawaz' },
    { name: 'Latifa', locale: 'ps-AF', value: 'ps-AF-Latifa' },
    { name: 'Alina', locale: 'ro-RO', value: 'ro-RO-Alina' },
    { name: 'Emil', locale: 'ro-RO', value: 'ro-RO-Emil' },
    { name: 'Dmitry', locale: 'ru-RU', value: 'ru-RU-Dmitry' },
    { name: 'Svetlana', locale: 'ru-RU', value: 'ru-RU-Svetlana' },
    { name: 'Sameera', locale: 'si-LK', value: 'si-LK-Sameera' },
    { name: 'Thilini', locale: 'si-LK', value: 'si-LK-Thilini' },
    { name: 'Lukas', locale: 'sk-SK', value: 'sk-SK-Lukas' },
    { name: 'Viktoria', locale: 'sk-SK', value: 'sk-SK-Viktoria' },
    { name: 'Petra', locale: 'sl-SI', value: 'sl-SI-Petra' },
    { name: 'Rok', locale: 'sl-SI', value: 'sl-SI-Rok' },
    { name: 'Muuse', locale: 'so-SO', value: 'so-SO-Muuse' },
    { name: 'Ubax', locale: 'so-SO', value: 'so-SO-Ubax' },
    { name: 'Anila', locale: 'sq-AL', value: 'sq-AL-Anila' },
    { name: 'Ilir', locale: 'sq-AL', value: 'sq-AL-Ilir' },
    { name: 'Nicholas', locale: 'sr-RS', value: 'sr-RS-Nicholas' },
    { name: 'Sophie', locale: 'sr-RS', value: 'sr-RS-Sophie' },
    { name: 'Jajang', locale: 'su-ID', value: 'su-ID-Jajang' },
    { name: 'Tuti', locale: 'su-ID', value: 'su-ID-Tuti' },
    { name: 'Mattias', locale: 'sv-SE', value: 'sv-SE-Mattias' },
    { name: 'Sofie', locale: 'sv-SE', value: 'sv-SE-Sofie' },
    { name: 'Rafiki', locale: 'sw-KE', value: 'sw-KE-Rafiki' },
    { name: 'Zuri', locale: 'sw-KE', value: 'sw-KE-Zuri' },
    { name: 'Daudi', locale: 'sw-TZ', value: 'sw-TZ-Daudi' },
    { name: 'Rehema', locale: 'sw-TZ', value: 'sw-TZ-Rehema' },
    { name: 'Pallavi', locale: 'ta-IN', value: 'ta-IN-Pallavi' },
    { name: 'Valluvar', locale: 'ta-IN', value: 'ta-IN-Valluvar' },
    { name: 'Kumar', locale: 'ta-LK', value: 'ta-LK-Kumar' },
    { name: 'Saranya', locale: 'ta-LK', value: 'ta-LK-Saranya' },
    { name: 'Kani', locale: 'ta-MY', value: 'ta-MY-Kani' },
    { name: 'Surya', locale: 'ta-MY', value: 'ta-MY-Surya' },
    { name: 'Anbu', locale: 'ta-SG', value: 'ta-SG-Anbu' },
    { name: 'Venba', locale: 'ta-SG', value: 'ta-SG-Venba' },
    { name: 'Mohan', locale: 'te-IN', value: 'te-IN-Mohan' },
    { name: 'Shruti', locale: 'te-IN', value: 'te-IN-Shruti' },
    { name: 'Niwat', locale: 'th-TH', value: 'th-TH-Niwat' },
    { name: 'Premwadee', locale: 'th-TH', value: 'th-TH-Premwadee' },
    { name: 'Ahmet', locale: 'tr-TR', value: 'tr-TR-Ahmet' },
    { name: 'Emel', locale: 'tr-TR', value: 'tr-TR-Emel' },
    { name: 'Ostap', locale: 'uk-UA', value: 'uk-UA-Ostap' },
    { name: 'Polina', locale: 'uk-UA', value: 'uk-UA-Polina' },
    { name: 'Gul', locale: 'ur-IN', value: 'ur-IN-Gul' },
    { name: 'Salman', locale: 'ur-IN', value: 'ur-IN-Salman' },
    { name: 'Asad', locale: 'ur-PK', value: 'ur-PK-Asad' },
    { name: 'Uzma', locale: 'ur-PK', value: 'ur-PK-Uzma' },
    { name: 'Madina', locale: 'uz-UZ', value: 'uz-UZ-Madina' },
    { name: 'Sardor', locale: 'uz-UZ', value: 'uz-UZ-Sardor' },
    { name: 'HoaiMy', locale: 'vi-VN', value: 'vi-VN-HoaiMy' },
    { name: 'NamMinh', locale: 'vi-VN', value: 'vi-VN-NamMinh' },
    { name: 'Thando', locale: 'zu-ZA', value: 'zu-ZA-Thando' },
    { name: 'Themba', locale: 'zu-ZA', value: 'zu-ZA-Themba' },
  ];

  isOpen = false;
  isEditMode = false;
  currentId: string | null = null;
  text: string = '';
  selectedVoiceValue: string = '';
  voiceSearchText: string = '';
  originalItem: any = null;
  voiceDropdownOpen = false;
  lastProcessedText: string = '';
  lastProcessedVoice: string = '';
  filteredVoices = [...this.allVoices];
  isLoading = false;
  audioFileId: string | null = null;
  audioElement: any;
  isPlaying = false;
  audioProgress = 0;
  currentTimeDisplay = '0:00';
  durationDisplay = '0:00';

  constructor(
    private ttsService: TtsService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.audioElement = new Audio();
      this.setupAudioListeners();
    }
  }
  open(item?: any) {
    this.isOpen = true;
    this.voiceDropdownOpen = false;
    this.isLoading = false;
    this.audioFileId = null;
    if (this.audioElement) {
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
    }
    this.isPlaying = false;
    this.audioProgress = 0;
    this.currentTimeDisplay = '0:00';
    this.durationDisplay = '0:00';

    if (item) {
      this.isEditMode = true;
      this.currentId = item.id;
      this.originalItem = item;
      this.text = item.text;
      this.selectedVoiceValue = item.voice;
      this.lastProcessedText = item.text;
      this.lastProcessedVoice = item.voice;
      const voiceObj = this.allVoices.find((v) => v.value === item.voice);
      this.voiceSearchText = voiceObj
        ? `${voiceObj.name} (${voiceObj.locale})`
        : item.voice;

      // Si el item ya tiene un audioFileId, podríamos cargarlo directamente
      if (item.audioFileId) {
        this.audioFileId = item.audioFileId;
        this.loadAudioBase64(this.audioFileId!);
      }
    } else {
      this.isEditMode = false;
      this.currentId = null;
      this.originalItem = null;
      this.text = '';
      this.selectedVoiceValue = '';
      this.voiceSearchText = '';
      this.lastProcessedText = '';
      this.lastProcessedVoice = '';
    }
    this.cdr.detectChanges();
  }

  close() {
    this.audioElement?.pause();
    this.isOpen = false;
    this.closed.emit();
  }

  ngOnDestroy() {
    this.audioElement?.pause();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
    }
  }

  filterVoices() {
    const term = this.voiceSearchText.toLowerCase();
    this.filteredVoices = this.allVoices.filter(
      (v) =>
        v.name.toLowerCase().includes(term) ||
        v.locale.toLowerCase().includes(term),
    );
  }

  selectVoice(voice: any) {
    this.selectedVoiceValue = voice.value;
    this.voiceSearchText = `${voice.name} (${voice.locale})`;
    this.voiceDropdownOpen = false;
  }

  closeDropdown() {
    setTimeout(() => {
      this.voiceDropdownOpen = false;
      this.cdr.detectChanges();
    }, 200);
  }

  setupAudioListeners() {
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement.duration) {
        this.audioProgress =
          (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.currentTimeDisplay = this.formatTime(
          this.audioElement.currentTime,
        );
        this.cdr.detectChanges();
      }
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.durationDisplay = this.formatTime(this.audioElement.duration);
      this.cdr.detectChanges();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.audioProgress = 0;
      this.currentTimeDisplay = '0:00';
      this.cdr.detectChanges();
    });
  }

  togglePlay() {
    if (!this.audioElement.src) return;

    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  seekAudio(event: any) {
    const value = event.target.value;
    if (this.audioElement.duration) {
      this.audioElement.currentTime =
        (value / 100) * this.audioElement.duration;
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  downloadAudio() {
    if (!this.audioElement?.src || this.audioElement.src.includes('null')) {
      alert('No hay audio generado para descargar');
      return;
    }

    const link = document.createElement('a');
    link.href = this.audioElement.src;
    const fileName = `audio-${this.selectedVoiceValue}-${Date.now()}.mp3`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewId() {
    alert(`ID de la orden: ${this.currentId || 'Nueva orden'}`);
  }

  get canProcess(): boolean {
    const hasChanges =
      this.text.trim() !== this.lastProcessedText ||
      this.selectedVoiceValue !== this.lastProcessedVoice;

    return (
      this.text.trim().length > 0 &&
      this.selectedVoiceValue !== '' &&
      !this.isLoading &&
      hasChanges
    );
  }

  executeAction() {
    if (!this.canProcess) return;

    this.isLoading = true;

    if (this.isEditMode && this.currentId && this.originalItem) {
      const updatePayload = {
        id: this.currentId,
        text: this.text,
        voice: this.selectedVoiceValue,
        createdAt: this.originalItem.createdAt,
        status: this.originalItem.status,
      };

      this.ttsService.updateTts(this.currentId, updatePayload).subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
          this.saved.emit(); 
        },
        error: (err) => {
          console.error('Error actualizando:', err);
          this.isLoading = false;
        },
      });
    } else {
      const createPayload = {
        voice: this.selectedVoiceValue,
        text: this.text,
      };

      this.ttsService.createTts(createPayload).subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
          this.saved.emit(); 
        },
        error: (err) => {
          console.error('Error creando:', err);
          this.isLoading = false;
        },
      });
    }
  }

  private handleSuccessResponse(response: any) {
    if (response) {
      this.currentId = response.id;
      this.audioFileId = response.audioFileId;
      this.lastProcessedText = this.text;
      this.lastProcessedVoice = this.selectedVoiceValue;

      setTimeout(() => {
        this.loadAudioBase64(this.currentId!);
      }, 600); 
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
  onTextChange() {
    if (
      this.text !== this.lastProcessedText ||
      this.selectedVoiceValue !== this.lastProcessedVoice
    ) {
      if (this.audioElement && this.audioElement.src) {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.load();
        this.audioFileId = null;
        this.audioProgress = 0;
        this.currentTimeDisplay = '0:00';
        this.isPlaying = false;
        this.cdr.detectChanges();
      }
    }
  }

  loadAudioBase64(id: string) {
    this.ttsService.getAudioBase64(id).subscribe({
      next: (base64Data: string) => {
        if (base64Data && base64Data.length > 0) {
          this.audioElement.src = `data:audio/mp3;base64,${base64Data}`;
          this.audioElement.currentTime = 0;
          this.audioElement.load();
          this.isLoading = false;
        } else {
          console.warn('El backend no envió datos de audio aún');
          this.isLoading = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener el audio:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
