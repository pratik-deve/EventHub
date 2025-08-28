package com.eventHubBackend.Spring.Backend.EventHub.BeanUtils;

import org.springframework.beans.BeanUtils;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class UpdateUtil {



    public static Object copyNonNullAndChangedProperties(Object source, Object target) {
        for (Field field : source.getClass().getDeclaredFields()) {
            try {
                field.setAccessible(true);
                Object value = field.get(source);
                if (value != null) {
                    Field targetField = target.getClass().getDeclaredField(field.getName());
                    targetField.setAccessible(true);
                    targetField.set(target, value);
                }
            } catch (Exception ignored) {}
        }

        return target;
    }

}

