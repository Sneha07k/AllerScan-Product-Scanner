import re

COMMON_ALLERGENS = [
    "milk",
    "peanut",
    "peanuts",
    "soy",
    "soybean",
    "wheat",
    "egg",
    "almond",
    "cashew",
    "walnut",
    "fish",
    "shellfish",
]

NON_VEGAN_INGREDIENTS = [
    "milk",
    "milk solids",
    "whey",
    "casein",
    "butter",
    "cream",
    "egg",
    "albumin",
    "gelatin",
    "honey",
    "yogurt",
]

OCR_CORRECTIONS = {
    "calorles": "calories",
    "calories": "calories",
    "protem": "protein",
    "fot": "fat",
    "sugor": "sugar",
    "carbohydrote": "carbohydrate",
}

from spellchecker import SpellChecker

spell = SpellChecker()


def correct_text(text):
    words = text.split()

    corrected = []

    for word in words:
        clean_word = re.sub(r"[^a-zA-Z]", "", word)

        if not clean_word:
            continue

        corrected_word = spell.correction(clean_word)

        corrected.append(corrected_word if corrected_word else clean_word)

    return " ".join(corrected)


def normalize_text(text):
    text = text.lower()

    for wrong, correct in OCR_CORRECTIONS.items():
        text = text.replace(wrong, correct)

    return text


def detect_allergens(text):
    text = normalize_text(text)

    detected = []

    for allergen in COMMON_ALLERGENS:
        if allergen in text:
            detected.append(allergen)

    return list(set(detected))


def is_vegan(text):
    text = normalize_text(text)

    for ingredient in NON_VEGAN_INGREDIENTS:
        if ingredient in text:
            return False

    return True


def extract_nutrition(text):
    text = normalize_text(text)

    nutrition = {
        "calories": None,
        "protein": None,
        "fat": None,
        "sugar": None,
        "carbohydrates": None,
        "fiber": None,
        "sodium": None,
    }

    calories_match = re.search(
        r"calories\s*[:\-]?\s*(\d+)",
        text,
        re.IGNORECASE,
    )

    if calories_match:
        nutrition["calories"] = calories_match.group(1)
    else:
        kcal_match = re.search(
            r"(\d+)\s*(kcal|keal|cal)",
            text,
            re.IGNORECASE,
        )

        if kcal_match:
            nutrition["calories"] = kcal_match.group(1)

    protein_match = re.search(
        r"protein[^0-9]*(\d+\.?\d*)\s*g",
        text,
        re.IGNORECASE,
    )

    fat_match = re.search(
        r"(?:total\s+)?fat[^0-9]*(\d+\.?\d*)\s*g",
        text,
        re.IGNORECASE,
    )

    sugar_match = re.search(
        r"sugars?[^0-9]*(\d+\.?\d*)\s*g",
        text,
        re.IGNORECASE,
    )

    carb_match = re.search(
    r"(?:(?:total\s+)?carbs?|carbohydrates?)[^0-9]*(\d+\.?\d*)\s*g",
    text,
    re.IGNORECASE,
    )

    fiber_match = re.search(
        r"(?:dietary\s+)?fiber[^0-9]*(\d+\.?\d*)\s*g",
        text,
        re.IGNORECASE,
    )

    sodium_match = re.search(
        r"sodium[^0-9]*(\d+\.?\d*)\s*mg",
        text,
        re.IGNORECASE,
    )

    if protein_match:
        nutrition["protein"] = protein_match.group(1) + "g"

    if fat_match:
        nutrition["fat"] = fat_match.group(1) + "g"

    if sugar_match:
        nutrition["sugar"] = sugar_match.group(1) + "g"

    if carb_match:
        nutrition["carbohydrates"] = carb_match.group(1) + "g"

    if fiber_match:
        nutrition["fiber"] = fiber_match.group(1) + "g"

    if sodium_match:
        nutrition["sodium"] = sodium_match.group(1) + "mg"

    return nutrition


def extract_ingredients(text):
    match = re.search(
        r"ingredients\s*:(.*?)(contains:|distributed by|manufactured by|$)",
        text,
        re.IGNORECASE | re.DOTALL,
    )

    if not match:
        return []

    ingredients_text = match.group(1)

    ingredients = []

    for ingredient in ingredients_text.split(","):
        cleaned = clean_ingredient(ingredient)

        if cleaned:
            ingredients.append(cleaned)

    return ingredients


def nutrition_rating(nutrition):
    score = 80

    calories = nutrition.get("calories")
    sugar = nutrition.get("sugar")
    sodium = nutrition.get("sodium")
    protein = nutrition.get("protein")
    fiber = nutrition.get("fiber")

    try:
        if calories:
            calories = int(str(calories).replace("kcal", "").strip())

            if calories > 400:
                score -= 15
            elif calories > 250:
                score -= 8
    except:
        pass

    try:
        if sugar:
            sugar = float(str(sugar).replace("g", "").strip())

            if sugar > 20:
                score -= 20
            elif sugar > 10:
                score -= 10
    except:
        pass

    try:
        if sodium:
            sodium = float(str(sodium).replace("mg", "").strip())

            if sodium > 500:
                score -= 15
            elif sodium > 250:
                score -= 8
    except:
        pass

    try:
        if protein:
            protein = float(str(protein).replace("g", "").strip())

            if protein >= 10:
                score += 10
            elif protein >= 5:
                score += 5
    except:
        pass

    try:
        if fiber:
            fiber = float(str(fiber).replace("g", "").strip())

            if fiber >= 5:
                score += 10
            elif fiber >= 3:
                score += 5
    except:
        pass

    score = max(0, min(score, 100))

    if score >= 90:
        rating = "Excellent"
    elif score >= 75:
        rating = "Good"
    elif score >= 55:
        rating = "Average"
    else:
        rating = "Poor"

    return {"score": score, "rating": rating}


def nutrition_summary(nutrition):
    summary = []

    calories = nutrition.get("calories")
    sugar = nutrition.get("sugar")
    protein = nutrition.get("protein")
    sodium = nutrition.get("sodium")

    if calories:
        calories = int(calories)

        if calories < 100:
            summary.append("Low calorie product")
        elif calories > 300:
            summary.append("High calorie product")

    if sugar:
        sugar = float(sugar.replace("g", ""))

        if sugar > 15:
            summary.append("High sugar content")

    if protein:
        protein = float(protein.replace("g", ""))

        if protein >= 10:
            summary.append("Good source of protein")

    if sodium:
        sodium = float(sodium.replace("mg", ""))

        if sodium > 300:
            summary.append("High sodium content")

    return summary


def analyze_text(text):
    nutrition = extract_nutrition(text)
    ingredients = extract_ingredients(text)

    return {
        # "product_name": extract_product_name(text),
        "vegan": is_vegan(text),
        "allergens_detected": detect_allergens(text),
        "ingredients": ingredients,
        "nutrition": nutrition,
        "nutrition_rating": nutrition_rating(nutrition),
        "nutrition_summary": nutrition_summary(nutrition),
    }


def clean_ingredient(ingredient):
    ingredient = re.sub(r"[^a-zA-Z0-9\s\-()]", "", ingredient)
    ingredient = ingredient.strip()

    if not ingredient:
        return None

    return ingredient.title()
