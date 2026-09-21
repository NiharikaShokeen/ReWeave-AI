/**
 * Fallback Assessment Provider (Local Heuristic Engine)
 *
 * IMPORTANT:
 * This fallback is NOT machine learning and is NOT a trained model.
 * It is a rule-assisted heuristic evaluation engine designed for the prototype
 * to demonstrate the decision-support workflow when no LLM API key is configured.
 *
 * Implements holistic interpretation of inputs:
 * - Material certainty & fiber behavior
 * - Physical dimensions & remnant form
 * - Condition, cleanliness, and moisture hazards
 * - Free-text workshop notes
 * - Responsible AI uncertainty rules
 */

import { validateAndNormalizeAssessment } from './schema.js';

export function evaluateWithFallback(batchInput) {
  // Normalize inputs safely (supporting both nested workshop structures and flat objects)
  const rawFabric = batchInput?.material?.fabricType ?? (typeof batchInput?.fabricType === 'string' ? batchInput.fabricType : '');
  const fabric = typeof rawFabric === 'string' ? rawFabric.trim() : '';

  const rawColor = batchInput?.material?.color ?? (typeof batchInput?.color === 'string' ? batchInput.color : '');
  const color = typeof rawColor === 'string' ? rawColor.trim() : '';

  const rawSize = batchInput?.physicalForm?.scrapSize ?? (typeof batchInput?.scrapSize === 'string' ? batchInput.scrapSize : '');
  const size = typeof rawSize === 'string' ? rawSize.trim() : '';

  const rawForm = batchInput?.physicalForm?.form ?? (typeof batchInput?.form === 'string' ? batchInput.form : '');
  const form = typeof rawForm === 'string' ? rawForm.trim() : '';

  const rawQuantity = batchInput?.physicalForm?.quantity ?? (typeof batchInput?.quantity === 'string' ? batchInput.quantity : '');
  const quantity = typeof rawQuantity === 'string' ? rawQuantity.trim() : '';

  const rawCondition = batchInput?.condition?.status ?? (typeof batchInput?.condition === 'string' ? batchInput.condition : '');
  const condition = typeof rawCondition === 'string' ? rawCondition.trim() : '';

  const rawDescription = batchInput?.condition?.description ?? (typeof batchInput?.description === 'string' ? batchInput.description : '');
  const description = typeof rawDescription === 'string' ? rawDescription.toLowerCase().trim() : '';

  const hasImage = Boolean(batchInput?.image);

  // --- Step 1: Detect Critical Uncertainty & Risk Flags ---
  const isUnknownFabric = !fabric || fabric.toLowerCase() === 'unknown' || fabric.toLowerCase() === 'unspecified';
  const isBlend = fabric.toLowerCase().includes('blend') || description.includes('blend') || description.includes('elastane') || description.includes('spandex');
  const isContaminated = condition.toLowerCase().includes('dirty') || condition.toLowerCase().includes('contaminated') || description.includes('oil') || description.includes('grease') || description.includes('stain');
  const isWet = condition.toLowerCase().includes('wet') || description.includes('damp') || description.includes('wet');
  const isDamagedOrFrayed = condition.toLowerCase().includes('damaged') || description.includes('frayed') || description.includes('shredded');
  const isSmallCut = size.toLowerCase().includes('small') || size.toLowerCase().includes('offcut') || form.toLowerCase().includes('small') || form.toLowerCase().includes('strips');
  const isLargeCut = size.toLowerCase().includes('large') || form.toLowerCase().includes('larger');
  const isMediumCut = size.toLowerCase().includes('medium');

  // Check for notes keywords
  const notesMentionLaunder = description.includes('wash') || description.includes('clean') || description.includes('launder');
  const notesMentionLiningOrPocket = description.includes('pocket') || description.includes('lining') || description.includes('facing');
  const notesMentionHardware = description.includes('zipper') || description.includes('button') || description.includes('hardware') || description.includes('interfacing');

  // --- Step 2: Determine Pathway, Potential, Confidence & Reasoning ---
  let recommended_pathway = 'FURTHER_CHECK';
  let reuse_potential = 'LOW';
  let confidence = 'MEDIUM';
  let reasoning = '';
  let material_assessment = '';
  const suggested_uses = [];
  const limitations = [];

  // Material Assessment Formulation
  const fabricLabel = isUnknownFabric ? 'Unidentified textile remnant' : `${fabric} fabric`;
  const colorLabel = color && color !== 'Unspecified' ? `in ${color}` : '';
  const sizeLabel = size && size !== 'Unspecified' ? `predominantly ${size.toLowerCase()}` : 'unspecified dimensions';
  const formLabel = form && form !== 'Unspecified' ? `in ${form.toLowerCase()} form` : '';
  const conditionLabel = condition && condition !== 'Unspecified' ? `exhibiting ${condition.toLowerCase()} condition` : 'unspecified surface condition';

  material_assessment = `Batch comprises ${fabricLabel} ${colorLabel} (${sizeLabel}${formLabel ? `, ${formLabel}` : ''}), currently ${conditionLabel}.${quantity && quantity !== 'Unspecified' ? ` Total volume logged at ${quantity}.` : ''}`;

  // --- Branch A: Severe Contamination or Moisture Hazards ---
  if (isWet || isContaminated) {
    recommended_pathway = 'FURTHER_CHECK';
    reuse_potential = 'LOW';
    confidence = isContaminated && isWet ? 'HIGH' : 'MEDIUM';

    reasoning = `Direct reuse and mechanical shredding are unviable in current condition. ${
      isWet ? 'Moisture introduces biological degradation (mildew/mold) and severely weakens tensile fiber strength. ' : ''
    }${
      isContaminated ? 'Soiled or chemical contaminants clog garnetting machinery and contaminate subsequent yarn streams. ' : ''
    }The batch must be thoroughly sorted, laundered, or decontaminated before any secondary lifecycle decision.`;

    suggested_uses.push(
      'Isolate damp batch immediately and air-dry to prevent mildew growth',
      'Hot-water launder or dry-clean to remove oil/chalk contaminants',
      'Segregate irreparably stained pieces for secondary industrial wiping rags',
      'Re-assess recovery pathway once materials are completely dry and clean'
    );

    limitations.push(
      'Contaminated textiles cannot be fed into circular recycling equipment without prior decontamination.',
      'Surface washability depends on the underlying dye fastness and fiber tolerance.'
    );
  }

  // --- Branch B: Unknown Fabric Identity / Insufficient Evidence ---
  else if (isUnknownFabric) {
    recommended_pathway = 'FURTHER_CHECK';
    reuse_potential = isLargeCut ? 'MEDIUM' : 'LOW';
    confidence = 'LOW';

    reasoning = `Material composition is unidentified. While physical remnant dimensions (${sizeLabel}) may offer physical utility, circular recovery pathways cannot be assigned safely without knowing whether fibers are cellulosic, protein, or synthetic. Processing mixed unknown fibers risks contaminating mono-material recycling streams or causing garment construction defects.`;

    suggested_uses.push(
      'Perform a workshop flame/burn test (observe flame color, odor, and bead residue)',
      'Cross-reference production cutting-room bolt tags or purchase invoices',
      'Sort scraps by tactile feel and stretch (warp/weft vs elastane content)',
      isLargeCut ? 'Use for internal non-critical prototyping or workshop utility cloths' : 'Segregate into unknown synthetic/natural sorting bins'
    );

    limitations.push(
      'Visual appraisal and user description alone cannot determine chemical fiber composition.',
      'Do not route into commercial textile recycling until natural vs synthetic fiber group is verified.',
      'Burn tests provide indicative fiber family identification but cannot quantify exact percentage blends.'
    );
  }

  // --- Branch C: Clean, Identifiable Large Remnants (Prime Reuse) ---
  else if (isLargeCut && !isDamagedOrFrayed) {
    recommended_pathway = 'REUSE';
    reuse_potential = 'HIGH';
    confidence = 'HIGH';

    reasoning = `Large, clean remnants of ${fabric} represent highest-tier circular value. Preserving the existing weave architecture retains 100% of embodied manufacturing energy and water, making direct product remanufacturing vastly superior to mechanical shredding.`;

    if (fabric.toLowerCase().includes('denim')) {
      suggested_uses.push(
        'Upcycled denim tote bags and tool rolls',
        'Patchwork jacket panels and modular denim accessories',
        'Durable pocketing and waistband reinforcements',
        'Workshop aprons and utility covers'
      );
    } else if (fabric.toLowerCase().includes('cotton')) {
      suggested_uses.push(
        'Internal garment facings, collar stands, and pocket bags',
        'Patchwork quilts, cushions, and home textiles',
        'Fabric bias binding tape and decorative trims',
        'Zero-waste tote bags and reusable produce sacks'
      );
    } else if (fabric.toLowerCase().includes('wool')) {
      suggested_uses.push(
        'Cold-weather accessories (ear-warmers, mittens, pocket warmers)',
        'Felted applique patches on outerwear',
        'Structured small accessory linings',
        'Patchwork wool blankets and seat cushions'
      );
    } else {
      suggested_uses.push(
        'Modular garment components (pockets, facings, plackets)',
        'Accessory linings and small pouches',
        'Patchwork craft projects and textile collages',
        'Workshop utility and sample construction'
      );
    }

    limitations.push(
      'Fiber composition assessment is based on operator declaration and visual inspection, not laboratory yarn testing.',
      'Ensure grainline alignment aligns with new pattern pieces to prevent differential shrinkage or warping.'
    );

    if (isBlend) {
      limitations.push(
        'Blended fibers retain structural integrity for sewing, but future end-of-life recycling will remain restricted.'
      );
    }
  }

  // --- Branch D: Medium Remnants (Viable Targeted Reuse) ---
  else if (isMediumCut && !isDamagedOrFrayed) {
    recommended_pathway = 'REUSE';
    reuse_potential = 'MEDIUM';
    confidence = 'MEDIUM';

    reasoning = `Medium-sized ${fabric} offcuts (15–50 cm) offer adequate surface area for small accessory production and internal garment components. Direct reuse remains preferred over mechanical shredding as it retains woven fiber length and integrity.`;

    suggested_uses.push(
      'Garment pocket bags, cuff facings, and under-collars',
      'Small zip pouches, coin purses, and eye-mask covers',
      'Quilt blocks, patchwork coasters, and fabric bunting',
      'Hair accessories (scrunchies, headbands, fabric ties)'
    );

    limitations.push(
      'Pattern yield per piece is limited; requires modular cutting or patchwork assembly.',
      'Visual evaluation cannot detect chemical finishing agents (e.g., water repellent or flame retardants).'
    );
  }

  // --- Branch E: Very Small Pieces / Offcuts / Shreds ---
  else if (isSmallCut || isDamagedOrFrayed) {
    if (isBlend) {
      // Blends + small cuts are very hard to recycle mechanically
      recommended_pathway = 'FURTHER_CHECK';
      reuse_potential = 'LOW';
      confidence = 'MEDIUM';

      reasoning = `Fragmented scrap dimensions make garment construction unfeasible, while blended fiber chemistry (${fabric}) complicates mechanical recycling. Most commercial garnetting recyclers require mono-fiber streams (e.g. >95% pure cotton or pure wool) to avoid synthetic melting or fiber breakage during carding.`;

      suggested_uses.push(
        'Non-woven thermal or acoustic insulation batting (downcycling)',
        'Punch-needle embroidery backing or firm cushion stuffing',
        'Workshop wiping rags (if non-synthetic/absorbent)',
        'Consultation with specialized composite fiber recyclers'
      );

      limitations.push(
        'Commercial textile recyclers frequently reject heterogeneous blends or elastane-containing scraps.',
        'Mechanical shredding of blended fibers shortens staple length, reducing downcycled tensile capacity.'
      );
    } else {
      // Mono-fiber small scraps are prime for mechanical recycling
      recommended_pathway = 'RECYCLE';
      reuse_potential = 'LOW';
      confidence = 'HIGH';

      reasoning = `Small remnant geometry (< 15 cm) yields poor cutting efficiency for sewn products. Clean, mono-material ${fabric} is well-suited for mechanical fiber recovery (defibration, garnetting, or carding) to convert offcuts into non-woven batting, acoustic panels, or regenerated spinning fiber.`;

      suggested_uses.push(
        `Mechanical shredding (shoddy) for ${fabric} fiber regeneration`,
        'Acoustic insulation panels and mattress felt padding',
        'Non-woven geotextile mats and automotive interior stuffing',
        'Zero-waste fiber stuffing for toys and floor cushions'
      );

      limitations.push(
        'Mechanical tearing shortens fiber length; respun yarn typically requires blending with 20–30% virgin fiber.',
        'Ensure all foreign matter (pins, plastic clips, interlinings) is removed prior to shredder feed.'
      );
    }
  }

  // --- Branch F: Default Composite Case ---
  else {
    recommended_pathway = isLargeCut ? 'REUSE' : 'FURTHER_CHECK';
    reuse_potential = isLargeCut ? 'MEDIUM' : 'LOW';
    confidence = 'MEDIUM';

    reasoning = `Composite batch evaluation indicates mixed recovery feasibility for ${fabric}. Balanced decision depends on specific workshop capability and sorting labor.`;

    suggested_uses.push(
      'Manual triage into uniform size bins',
      'Test piece cutting for small utility accessories',
      'Secondary non-critical workshop applications'
    );

    limitations.push(
      'Evaluation is constrained by incomplete batch attributes.',
      'Physical inspection required before committing to production cutting or recycling consignment.'
    );
  }

  // Global Limitations Additions
  if (hasImage) {
    limitations.push(
      'Visual image reference was reviewed for surface pattern and geometry, but ordinary photos cannot prove fiber chemical composition.'
    );
  }

  if (notesMentionHardware) {
    limitations.push(
      'Batch notes indicate presence of hardware or interfacings. These must be manually deconstructed before shredding.'
    );
  }

  // Return strictly validated schema object
  return validateAndNormalizeAssessment(
    {
      material_assessment,
      reuse_potential,
      recommended_pathway,
      suggested_uses,
      reasoning,
      confidence,
      limitations,
    },
    'local_fallback'
  );
}
