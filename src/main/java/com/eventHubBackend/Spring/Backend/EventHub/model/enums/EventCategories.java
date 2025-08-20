package com.eventHubBackend.Spring.Backend.EventHub.model.enums;


public enum EventCategories {
    GENERAL("General"),
    MUSIC("Music"),
    TECHNOLOGY("Technology"),
    FOOD_AND_DRINK("Food & Drink"),
    ARTS_AND_CULTURE("Arts & Culture"),
    SPORTS_AND_FITNESS("Sports & Fitness"),
    BUSINESS("Business");

    private final String label;

    EventCategories(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
