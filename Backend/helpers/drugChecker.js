const KNOWN_CONFLICTS = [
    { drugs: ['aspirin', 'warfarin'], severity: 'High', message: 'Aspirin and Warfarin increase the risk of severe bleeding.' },
    { drugs: ['ibuprofen', 'warfarin'], severity: 'High', message: 'Ibuprofen and Warfarin increase the risk of gastrointestinal bleeding.' },
    { drugs: ['lisinopril', 'potassium'], severity: 'Medium', message: 'Lisinopril and Potassium supplements can lead to high potassium levels (hyperkalemia).' },
    { drugs: ['metformin', 'contrast dye'], severity: 'High', message: 'Metformin and Iodinated Contrast Media may cause kidney damage or lactic acidosis.' },
    { drugs: ['viagra', 'nitroglycerin'], severity: 'Critical', message: 'Viagra (Sildenafil) and Nitroglycerin can cause a life-threatening drop in blood pressure.' },
    { drugs: ['sildenafil', 'nitroglycerin'], severity: 'Critical', message: 'Sildenafil and Nitroglycerin can cause a life-threatening drop in blood pressure.' }
];

/**
 * Checks a list of medicine names for known conflicts.
 * @param {string[]} medicines 
 * @returns {object[]} conflicts detected
 */
function checkDrugConflicts(medicines) {
    const list = medicines
        .filter(Boolean)
        .map(m => m.toLowerCase().trim());
        
    const conflicts = [];
    for (const conflict of KNOWN_CONFLICTS) {
        // Check if both drugs in the conflict pair are matched in the user's input list
        const matches = conflict.drugs.filter(cdrug => 
            list.some(m => m.includes(cdrug) || cdrug.includes(m))
        );
        if (matches.length === 2) {
            conflicts.push(conflict);
        }
    }
    return conflicts;
}

module.exports = {
    checkDrugConflicts
};
